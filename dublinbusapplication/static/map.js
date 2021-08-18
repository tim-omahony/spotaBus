const DUBLIN_LAT = 53.349804;
const DUBLIN_LNG = -6.260310;

let map;
let markers;
let stops;
let pos;
let stations;
let markerClusterer;
let currentWeather;
let googleResponse;
let RouteShortname;
let Direction_Steps;
let steps_array;
let start_stop_lat_lon;
let end_stop_lat_lon;
let Journey_Steps;
let Google_Journey_time;
let InitialMap;
let weatherForecast;
let favourites;


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

    InitialMap = new AutocompleteDirectionsHandler(map);
}

// this function is used to parse JSON (used for the data on stops and Dublin Bikes stations
function loadJson(selector) {
    return JSON.parse(document.getElementById(selector).textContent);
}

