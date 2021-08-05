/*// function to provide date time picker if the user wants to plan a journey in the future
/!*$(function () {
    $('#date-toggle-event').change(function () {
        if ($(this).prop('checked') == true) {
            $('#datetime-toggle').html('<input form = "form" id="predictTime" class="form-control" ' +
                'type="datetime-local" name="predict" value="'+Date.now+'" required onChange="AutocompleteDirectionsHandler.route()">');
        } else {
            $('#datetime-toggle').html('');
        }
    })
})*!/*/

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


