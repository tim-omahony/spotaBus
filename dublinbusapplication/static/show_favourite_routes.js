let favouriteEnabled = false
// this function displays the user's favourite routes when the button is clicked
// if the button is clicked again it hides the user's favourite routes and defaults to Google's autocompelte functionality
function showFavourites() {
    favouriteEnabled = !favouriteEnabled
    favourites = loadJson("fave-routes-data");
    const originList = document.getElementById("originList");
    const destList = document.getElementById("destinationList")
    const confirmSelection = document.getElementById("confirmSelection")
    if (favouriteEnabled) {
        // for each which iterates over the list of user's favourite routes (loaded when index.html is loaded)
        // for each element in their favourite routes it creates a new option tag which is appended to the
        // datalists for the origin or destination
        confirmSelection.style.display = "block";
        document.getElementById("star-btn").style.color = '#ffcd4f';
        favourites.forEach(favourite => {
            const originOpt = document.createElement('option');
            originOpt.value = favourite.users_origin_stop;
            originList.appendChild(originOpt);
            const destOpt = document.createElement('option');
            destOpt.value = favourite.users_dest_stop;
            destList.appendChild(destOpt);
        })
    } else {
        confirmSelection.style.display = "none";
        // if the butto
        // n is clicked again the list is wiped
        document.getElementById("star-btn").style.color = '#222';
        originList.innerHTML = ""
        destList.innerHTML = ""
    }
}
