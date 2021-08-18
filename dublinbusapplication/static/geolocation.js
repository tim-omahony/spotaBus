// this function returns the location of the user as a point on the map in lat and long coordinates
// and calls the find_address function
function Geolocation() {

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            find_address(pos)
        })
}

//using reverse geocoding this function takes the current location of the user and converts the lat and long to
//a location name which is then input into the origin input field
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



