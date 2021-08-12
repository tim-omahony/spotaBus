function takeTrip(originStop, destStop) {
    console.log('here')
    location.replace(`/?originStop=${originStop}&destStop=${destStop}&openRoutePlanner=true`)
}
