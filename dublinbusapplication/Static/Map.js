var DUBLIN_LAT = 53.349804;
var DUBLIN_LNG = -6.260310;

var DUBLIN_BOUNDS = {
            north: 53.4,
            south: 53.3,
            west: -6.3103,
            east: -6.2305,
};

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById("MapView"), {
        center: { lat: DUBLIN_LAT, lng: DUBLIN_LNG },
        zoom: 14,
        restriction: {
            latLngBounds: DUBLIN_BOUNDS,
            strictBounds: false,
        }
        });
        }
