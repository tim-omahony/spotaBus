let trip

function takeTrip(originStop, destStop) {
    trip = true
    console.log('here')
    location.replace(`/?originStop=${originStop}&destStop=${destStop}&openRoutePlanner=true`)
}
