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


function initMap() {
    map = new google.maps.Map(document.getElementById("MapView"), {
        center: {lat: DUBLIN_LAT, lng: DUBLIN_LNG},
        zoom: 14,
        // restriction: {
        //     latLngBounds: DUBLIN_BOUNDS,
        //     strictBounds: false,
        // }
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
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}


function deleteMarkers(markersArray) {
    for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}

function loadJson(selector) {
    return JSON.parse(document.getElementById(selector).textContent);
}

window.onload = function () {
    stops = loadJson("stops-data")
    stations = loadJson("stations-data")
    // populateDublinBikes();
}

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
    new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
}


function populateStops() {
    markers = stops.map(stop => {
        return new google.maps.Marker({
            position: {
                lat: Number.parseFloat(stop.stop_lat),
                lng: Number.parseFloat(stop.stop_lon)
            },
            title: stop.stop_name,
            map: map
        })
    });
    new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
}

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

    constructor(map) {
        this.map = map;
        this.originId = "";
        this.destinationId = "";
        this.travelMode = google.maps.TravelMode.TRANSIT;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);

        const originInput = document.getElementById("origin-input");
        const destinationInput = document.getElementById("destination-input");
        this.setupStopChangeListener(originInput, "ORIG");
        this.setupStopChangeListener(destinationInput, "DEST");
    }

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

    route() {
        if (!this.originId || !this.destinationId) {
            return;
        }
        const originStop = stops.find(stop => stop.id === parseInt(this.originId));
        const destinationStop = stops.find(stop => stop.id === parseInt(this.destinationId));
        console.log({originStop, destinationStop});

        this.directionsService.route(
            {
                origin: {lat: originStop.stop_lat, lng: originStop.stop_lon},
                destination: {lat: destinationStop.stop_lat, lng: destinationStop.stop_lon},
                travelMode: 'TRANSIT',
            },

            (response, status) => {
                if (status === "OK") {
                    this.directionsRenderer.setDirections(response);
                    console.log(response)
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
}


$(document).ready(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();
        const inputTime = new Date($('#predictTime').val())
        $.ajax({
            type: 'POST',
            url: "/dublinbusapplication/predict/",
            data:
                {
                    hour: inputTime.getHours(),
                    day: inputTime.getDay(),
                    month: inputTime.getMonth(),
                    csrfmiddlewaretoken,
                    dataType: "json",
                },

            success: function (result) {

                $('#output').html("<p>Estimated journey time: " + result + " minutes</p>");
            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})


