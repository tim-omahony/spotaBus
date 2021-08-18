//function hides the card on the right side of index.html on button click
function hideCard() {
    const cardSection = document.getElementById("top-card")
    cardSection.style.display = "none";
    mergeWeather();
}