let favouriteEnabled = false

function showFavourites() {
    favouriteEnabled = !favouriteEnabled
    favourites = loadJson("fave-routes-data");
    const originList = document.getElementById("originList");
    const destList = document.getElementById("destinationList");
    if (favouriteEnabled) {
        document.getElementById("star-btn").style.color='#ffcd4f';
        favourites.forEach(favourite => {
            const originOpt = document.createElement('option');
            originOpt.value = favourite.users_origin_stop;
            originList.appendChild(originOpt);
            const destOpt = document.createElement('option');
            destOpt.value = favourite.users_dest_stop;
            destList.appendChild(destOpt);
        })
    } else {
        document.getElementById("star-btn").style.color='#222';
        originList.innerHTML = ""
        destList.innerHTML = ""
    }
}

function changeColor() {

}
