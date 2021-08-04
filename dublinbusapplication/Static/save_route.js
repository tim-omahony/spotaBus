function saveRoute() {
    $.ajax({
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
            alert("Route successfully saved to database!")
        },

        failure: function (result) {
            console.log(result)
        }
    })
}
