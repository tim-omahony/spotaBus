// function to save route to the database
function saveRoute() {
    $.ajax({
        // POST request takes the start and end addresses from the Google response and adds them to the origin and destination fields in the stops table of the database
        type: 'POST',
        url: "/add_favourite_route/",
        data:
            {
                users_origin_stop: googleResponse.routes[0].legs[0].start_address,
                users_dest_stop: googleResponse.routes[0].legs[0].end_address,
                csrfmiddlewaretoken,
                dataType: "json",
            },

        // if the function properly sends data to the predictive model the estimated travel time is returned
        success: function (result) {
            console.log('success', result)

            SaveRouteAlert();

        },

        failure: function (result) {
            console.log(result)
        }
    })
}


function SaveRouteAlert(){
	swal("This route has been successfully saved!");
}

