// this function renders markers on the map based on the location of Dublin Bikes stations contained within the DB
function populateDublinBikes() {
    //station info is loaded using the stations-data json which is loaded when index.html is loaded
    stations = loadJson("stations-data")
    markers = stations.map(station => {
        return new google.maps.Marker({
            position: {
                lat: Number.parseFloat(station.Latitude),
                lng: Number.parseFloat(station.Longitude)
            },
            title: station.Address,
            map: map,
            icon: "https://img.icons8.com/windows/32/000000/bicycle.png"
        });
    });
    //marker clusters used to reduce clutter on map
    markerClusterer = new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
}

// function to clear markers from the map
function clearMarkers() {
    markerClusterer.clearMarkers();
}
