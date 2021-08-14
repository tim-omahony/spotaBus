// this function checks the text in the Plan Journey button and changes it if a trip has already been planned
function changeButtonValue() {
    const planButton = document.getElementById("planButton");
    if (planButton.innerHTML === "Plan Your Journey") {
        planButton.innerHTML = "Plan Another Journey";
    } else {
        planButton.innerHTML = "Plan Another Journey";
    }
}

// this function checks the text in the Plan Journey button and changes it if a trip has already been planned
$(function () {
    $('#plan_journey_btn').click(function () {
        const title = document.getElementById("card-title");
        title.innerHTML = "See your journey details below!";

    })
})

//this function toggles between using the user's location as origin point or not
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

// function to hide modal box when plan journey is clicked and scroll down to output

function hidemodal() {

    $('#plan_journey_btn').click(function () {
        $('#exampleModal').modal('hide');
        $('html,body').animate({
                scrollTop: $("#output").offset().top
            },
            'slow');
    });

}

// this function ensures that all input fields have been field before proceeding with
// the button change and the hiding of the modal box
function validateForm() {
    var a = document.getElementById("origin-input").value || document.getElementById("origin-input-fav");
    var b = document.getElementById("destination-input").value || document.getElementById("destination-input-fav");
    var c = document.getElementById("predictTime").value;

    if (a == null || a == "" || b == null || b == "" || c == null || c == "") {
        JSalert();

    } else {

        changeButtonValue();
        hidemodal();
        submit_form();
    }
}

function JSalert() {
    swal("Please fill out the required fields ");
}


