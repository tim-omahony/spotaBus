// this function returns the location of the user as a point on the map
function Geolocation() {

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            console.log(pos)
            find_address(pos)
        })

}

function find_address(pos) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({location: pos})
        .then((response) => {
            if (response.results[0]) {
                document.getElementById("origin-input").value = response.results[0].formatted_address;
            } else {
                alert("No results found");
            }
        })

        .catch((e) => window.alert("Geocoder failed due to: " + e));
}


/*
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
*/
