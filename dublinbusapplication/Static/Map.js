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

function initMap() {
    map = new google.maps.Map(document.getElementById("MapView"), {
        center: {lat: DUBLIN_LAT, lng: DUBLIN_LNG},
        zoom: 14,
        // restriction: {
        //     latLngBounds: DUBLIN_BOUNDS,
        //     strictBounds: false,
        // }
    });
    populateStops(map);
}


function populateStops(map) {
    fetch('stops/').then(async response => {
        const data = await response.json();
        stops = data.stops;
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
    })
}
