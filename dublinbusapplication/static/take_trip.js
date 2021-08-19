//Redirects the user to the home page with the origin and destination filled into modal
function takeTrip(originStop, destStop) {
    location.replace(`/?originStop=${originStop}&destStop=${destStop}&openRoutePlanner=true`)
}
