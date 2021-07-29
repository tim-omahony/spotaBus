const DUBLIN_LAT = 53.349804;
const DUBLIN_LNG = -6.260310;

const DUBLIN_BOUNDS = {
    north: 53.4,
    south: 53.3,
    west: -6.3103,
    east: -6.2305,
};

let map;
let markers;
let stops;
let pos;
let stations;
let markerClusterer;
let originStop;
let destinationStop;
let currentWeather;
let googleResponse;
let enableFav;
let RouteShortname;
// function to render the map on the main application page

function initMap() {
    map = new google.maps.Map(document.getElementById("MapView"), {
        center: {lat: DUBLIN_LAT, lng: DUBLIN_LNG},
        zoom: 14,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP,
        },
        fullscreenControl: true,
    });
    Geolocation();
    new AutocompleteDirectionsHandler(map);
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, "click", () => {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}


function formattedDate() {
    var currentDate = new Date();
    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();
    var today = year + '-' + month + '-' + day;
    console.log('formatted date is ' + today);
    return today;
}

function publicHolidayChecker() {
  fetch('https://www.googleapis.com/calendar/v3/calendars/en.irish%23holiday%40group.v.calendar.google.com/events?key=AIzaSyBpmxEf_9hpbApu3UhIu8jY41LDdgPFkqc').then((response) => {
  if (response.ok) {
    console.log('public holiday json retrieved successfully');
    return response.json();
  } else {
    throw new Error('Something went wrong');
  }
})
.then((responseJson) => {
  // Do something with the response
  var holidays = [];



  for (var i=0; i < responseJson.items.length; i++) {
    holidays.push([responseJson.items[i].start.date, responseJson.items[i].summary]);
  }

  console.log(holidays);

  for (let item of holidays) {
  if (item[0] === formattedDate()) {

    document.getElementById("holidayWidget").innerHTML ="Please be advised today is`"+item[1]+ ", bus schedules may be affected.";
    document.getElementById("holidayWidget").style.visibility = "visible";
    break;
  }
  }


})
.catch((error) => {
  console.log(error)
});
}




publicHolidayChecker();

function DistanceMatrix() {
    const bounds = new google.maps.LatLngBounds();
    const markersArray = [];

    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();


    // build request
    // const origin1 = pos;
    const origin1 = {lat: 53.349804, lng: -6.260310}
    const origin2 = "Your Location";
    const destinationA = "Stockholm, Sweden";
    const destinationB = {lat: 55.93, lng: -3.120};
    const request = {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };

    // document.getElementById("request").innerText = JSON.stringify(
    //     request,
    //     null,
    //     2
    // );
    // get distance matrix response
    service.getDistanceMatrix(request).then((response) => {
        // put response
        // document.getElementById("response").innerText = JSON.stringify(
        //     response,
        //     null,
        //     2
        // );
        // show on map
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        // deleteMarkers(markersArray);

        const showGeocodedAddressOnMap = (asDestination) => {
            const handler = ({results}) => {
                map.fitBounds(bounds.extend(results[0].geometry.location));
                markersArray.push(
                    new google.maps.Marker({
                        map,
                        position: results[0].geometry.location,
                        label: asDestination ? "D" : "O",
                    })
                );
            };
            return handler;
        };

        for (let i = 0; i < originList.length; i++) {
            const results = response.rows[i].elements;
            geocoder
                .geocode({address: originList[i]})
                .then(showGeocodedAddressOnMap(false));

            for (let j = 0; j < results.length; j++) {
                geocoder
                    .geocode({address: destinationList[j]})
                    .then(showGeocodedAddressOnMap(true));
            }
        }
    });
}

// this function returns the location of the user as a point on the map

function Geolocation() {
    infoWindow = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");
    locationButton.textContent = "Click to see my position";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Your location.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // if the browser doesn't support Geolocation this error is returned
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

// this function is used to parse JSON (used for the data on stops and Dublin Bikes stations
function loadJson(selector) {
    return JSON.parse(document.getElementById(selector).textContent);
}

// when the main window of the application loads data on Dublin Bus stops and Dublin Bikes stations

window.onload = function () {
    stops = loadJson("stops-data")
    stations = loadJson("stations-data")
}

// this function renders markers on the map based on the location of Dublin Bikes stations contained within the DB

function populateDublinBikes() {
    markers = stations.map(station => {
        return new google.maps.Marker({
            position: {
                lat: Number.parseFloat(station.Latitude),
                lng: Number.parseFloat(station.Longitude)
            },
            title: station.Address,
            map: map
        });
    });
    markerClusterer = new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
}

// function to clear markers from the map

function clearMarkers() {
    markerClusterer.clearMarkers();
}

// this function renders markers on the map based on the location of Dublin Bus stops contained within the DB

// function populateStops() {
//     markers = stops.map(stop => {
//         return new google.maps.Marker({
//             position: {
//                 lat: Number.parseFloat(stop.stop_lat),
//                 lng: Number.parseFloat(stop.stop_lon)
//             },
//             title: stop.stop_name,
//             map: map
//         })
//     });
// }

//this function  handles geolocation errors based on whether the browser supports geolocation or if the service fails

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}


class AutocompleteDirectionsHandler {
    map;
    originId;
    destinationId;
    travelMode;
    directionsService;
    directionsRenderer;

    // constructors based on the origin and destination inputs provided to the application

    constructor(map) {
        this.map = map;
        this.originId = "";
        this.destinationId = "";
        // travel mode TRANSIT means that buses will be used as the desired mode of travel
        this.travelMode = google.maps.TravelMode.TRANSIT;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);

        // retrieves the origin and destination stops from index.html
        const originInput = document.getElementById("origin-input");
        const destinationInput = document.getElementById("destination-input");
        this.setupStopChangeListener(originInput, "ORIG");
        this.setupStopChangeListener(destinationInput, "DEST");
    }

    // provides the route between two given stops
    setupStopChangeListener(selectElement, mode) {
        selectElement.addEventListener('change', (event) => {
            if (mode === "ORIG") {
                this.originId = event.target.value;
            } else {
                this.destinationId = event.target.value;
            }
            this.route();
        });
    }

    // the route function uses the Google directions API to find the route between two given stations

    route() {
        if (!this.originId || !this.destinationId) {
            return;
        }
        originStop = stops.find(stop => stop.stop_name === (this.originId));
        destinationStop = stops.find(stop => stop.stop_name === (this.destinationId));
        console.log({originStop, destinationStop});

        this.directionsService.route(
            {
                origin: {lat: originStop.stop_lat, lng: originStop.stop_lon},
                destination: {lat: destinationStop.stop_lat, lng: destinationStop.stop_lon},
                travelMode: 'TRANSIT',
                transitOptions: {
                    modes: ['BUS'],
                    routingPreference: 'FEWER_TRANSFERS',

                }
            },

            (response, status) => {
                if (status === "OK") {
                    this.directionsRenderer.setDirections(response);

                    var Steps = response.routes[0].legs[0].steps.length;
                    var steps_array = [];
                    for (var y = 0; y < Steps; y++) {

                        var Transit_Type = response.routes[0].legs[0].steps[y].travel_mode;

                        if (Transit_Type == "TRANSIT") {
                            var route_dict = {};
                            RouteShortname = response.routes[0].legs[0].steps[y].transit.line.short_name;
                            route_dict['route'] = RouteShortname;
                            steps_array.push(route_dict);
                            }
                        }
                    console.log(steps_array)

                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        )
    }
}

// function to retrieve the most recent weather update from openweathermap
function getWeather() {
    currentWeather = ($.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=53.344&lon=-6.2672&appid=37038b4337b3dbf599fe6b12dad969bd"))
    console.log(currentWeather)
    return currentWeather
}

// function to retrieve the 5 day forecast from openweatherapi
function getForecast() {
    weatherForecast = ($.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=53.344&lon=-6.2672&appid=37038b4337b3dbf599fe6b12dad969bd"))
    console.log(weatherForecast)
    return weatherForecast
}

// function to return provided details on travel to the prediction model
$(document).ready(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();
        const inputTime = new Date($('#predictTime').val())
        $.ajax({
            type: 'POST',
            url: "/predict/",
            data:
                {

                    route: RouteShortname,
                    hour: inputTime.getHours(),
                    day: inputTime.getDay(),
                    month: inputTime.getMonth(),
                    temp: currentWeather.responseJSON.main.temp,
                    wind_speed: currentWeather.responseJSON.wind.speed,
                    humidity: currentWeather.responseJSON.main.humidity,
                    weather_main: currentWeather.responseJSON.weather[0].main,
                    start_stop_id: originStop.stop_id,
                    end_stop_id: destinationStop.stop_id,
                    csrfmiddlewaretoken,
                    dataType: "json",
                },

            // if the function properly sends data to the predictive model the estimated travel time is returned
            success: function (result) {
                console.log(result)
                $('#output').html("<p>Estimated journey time: " + result + " minutes</p>"
                 /*   "<p>You will arrive at approximately:  " + googleResponse.routes[0].legs[0].arrival_time.text + "</p>"*/);
            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})

function saveRoute() {
    $.ajax({
        type: 'POST',
        url: "/add_favourite_route/",
        data:
            {
                users_origin_stop: originStop.stop_id,
                users_dest_stop: destinationStop.stop_id,
                csrfmiddlewaretoken,
                dataType: "json",
            },

        // if the function properly sends data to the predictive model the estimated travel time is returned
        success: function (result) {
            console.log('success', result)
        },

        failure: function (result) {
            console.log(result)
        }
    })
}

// function to provide date time picker if the user wants to plan a journey in the future
$(function () {
    $('#date-toggle-event').change(function () {
        if ($(this).prop('checked') == true) {
            $('#datetime-toggle').html('<input form = "form" id="predictTime" class="form-control" ' +
                'type="datetime-local" name="predict" required onclick="getForecast()">');
        } else {
            $('#datetime-toggle').html('');
        }
    })
})



// function toggles between showing and hiding Dublin Bikes stations on the map
$(function () {
    $('#bike-toggle-event').change(function () {
        if ($(this).prop('checked') == true) {
            $(populateDublinBikes());
        } else {
            $(clearMarkers());
        }
    })
})

