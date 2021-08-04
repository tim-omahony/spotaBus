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
let googleHandler;
let dbAutocomplete;
let Direction_Steps;
let steps_array;
let start_stop_lat_lon;
let end_stop_lat_lon;
let Journey_Steps;
let Google_Journey_time;

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


            for (var i = 0; i < responseJson.items.length; i++) {
                holidays.push([responseJson.items[i].start.date, responseJson.items[i].summary]);
            }

            console.log(holidays);

            for (let item of holidays) {
                if (item[0] === formattedDate()) {

                    document.getElementById("holidayWidget").innerHTML = "Please be advised today is`" + item[1] + ", bus schedules may be affected.";
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
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;

    constructor(map) {
        this.map = map;
        this.originPlaceId = "";
        this.destinationPlaceId = "";
        this.travelMode = google.maps.TravelMode.TRANSIT;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);
        const options = {
            componentRestrictions: {country: "ie"}
        };
        const originInput = document.getElementById("origin-input");
        const destinationInput = document.getElementById("destination-input");
        const originAutocomplete = new google.maps.places.Autocomplete(originInput,options);
        // Specify just the place data fields that you need.
        originAutocomplete.setFields(["place_id"]);
        const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput,options
        );


        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    }


    // provides the route between two given stops

    setupPlaceChangedListener(autocomplete, mode) {
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }

            if (mode === "ORIG") {
                this.originPlaceId = place.place_id;
            } else {
                this.destinationPlaceId = place.place_id;
            }
            this.route();
        });
    }

    route() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        const me = this;
        this.directionsService.route(
            {
                origin: {placeId: this.originPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: 'TRANSIT',
                transitOptions: {
                    modes: ['BUS'],
                    routingPreference: 'FEWER_TRANSFERS',

                }
            },

            (response, status) => {
                if (status === "OK") {
                    me.directionsRenderer.setDirections(response);

                    var Steps = response.routes[0].legs[0].steps.length;
                    steps_array = [];

                    for (var y = 0; y < Steps; y++) {
                        var route_dict = {};
                        var Transit_Type = response.routes[0].legs[0].steps[y].travel_mode;

                        Direction_Steps = [];
                        Direction_Steps = response.routes[0].legs[0].steps[y].instructions;

                        route_dict['instructions'] = Direction_Steps;


                        if (Transit_Type == "WALKING") {
                            route_dict['transit_type'] = Transit_Type;
                        }

                        if (Transit_Type == "TRANSIT") {
                            RouteShortname = [];
                            start_stop_lat_lon = [];
                            end_stop_lat_lon = [];

                            RouteShortname = response.routes[0].legs[0].steps[y].transit.line.short_name;
                            start_stop_lat_lon = response.routes[0].legs[0].steps[y].start_location.lat() + ',' + response.routes[0].legs[0].steps[y].start_location.lng();
                            end_stop_lat_lon = response.routes[0].legs[0].steps[y].end_location.lat() + ',' + response.routes[0].legs[0].steps[y].end_location.lng();
                            Google_Journey_time = response.routes[0].legs[0].steps[y].duration['value']

                            route_dict['route'] = RouteShortname;
                            route_dict['start_stop_lat_lon'] = start_stop_lat_lon;
                            route_dict['end_stop_lat_lon'] = end_stop_lat_lon;
                            route_dict['transit_type'] = Transit_Type;
                            route_dict['Google_Journey_time'] = Google_Journey_time;
                        }
                        steps_array.push(route_dict);
                    }

                    console.log(response)
                    console.log(steps_array)

                } else {
                    window.alert("Directions request failed due to " + status);
                }

                Journey_Steps = JSON.stringify(steps_array);
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
                    steps_array: Journey_Steps,
                    csrfmiddlewaretoken,
                    dataType: "json",
                },

            // if the function properly sends data to the predictive model the estimated travel time is returned
            success: function (result) {
                console.log(result)
                $('#output').html("<p>Estimated Bus Journey Time: " + result + " minutes</p>");
            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})

function instructions_display(array) {
    var Steps = array.length;
    var str = '<ul>'
    for (var y = 0; y <= Steps; y++) {
        str += '<li>' + array[y].instructions + '</li>';
    }
    str += '</ul>';
    document.getElementById('slideContainer').innerHTML = str;

}

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
            alert("Route successfully saved to database!")
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

