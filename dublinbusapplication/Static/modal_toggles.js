function changeButtonValue() {
    const planButton = document.getElementById("planButton");
    if (planButton.innerHTML === "Plan Your Journey") {
        planButton.innerHTML = "Plan Another Journey";
    } else {
        planButton.innerHTML = "Plan Another Journey";
    }
}

$(function () {
    $('#origin-toggle-event').change(function () {
        if ($(this).prop('checked') == true) {
            $(Geolocation());
        } else {
            document.getElementById("origin-input").value = null;
        }
    })
})

// function toggles between showing and hiding Dublin Bikes stations on the map
$(function () {
    $('#bike-toggle-event').change(function () {
        if ($(this).prop('checked') == true) {
            $(populateDublinBikes());
        } else {
            $(clearMarkers());
        }
    })
})
