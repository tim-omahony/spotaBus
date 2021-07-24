var autocomplete;
var autocomplete2;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
        componentRestrictions: {country: "ie"},
        fields: ["address_components", "geometry"],
        types: ["address"]
    });

    autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('autocomplete2'), {
        componentRestrictions: {country: "ie"},
        fields: ["address_components", "geometry"],
        types: ["address"]
    });

    var input = document.getElementById('autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        console.log(place.geometry.location.lat());
        console.log(place.geometry.location.lng());
    });

    var input2 = document.getElementById('autocomplete2');
    var autocomplete2 = new google.maps.places.Autocomplete(input2);
    google.maps.event.addListener(autocomplete2, 'place_changed', function () {
        var place2 = autocomplete2.getPlace();
        console.log(place2.geometry.location.lat());
        console.log(place2.geometry.location.lng());
    });

}

function todays_date() {
    var currentDate = new Date();
    console.log(currentDate);
    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();

    var today = day + '/' + month + '/' + year;

    document.getElementById("currentDate").innerHTML = today;
}