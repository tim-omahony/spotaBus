
function removeFav(username){
     $.ajax({
        type: 'DELETE',
        url: "/delete_fav_route/",
        data:
            {
                username: username,
                csrfmiddlewaretoken,
                dataType: "json",
            },

        // if the function properly sends data to the predictive model the estimated travel time is returned
        success: function (result) {
            console.log('success, record was deleted', result)
            console.log(fave_routes)
        },

        failure: function (result) {
            console.log('ERROR: the record was not removed from the DB', result)
        }
    })

}

