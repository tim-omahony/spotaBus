/*function that is executed when the delete button is clicked with the checkboxes filled out.
* The IDs of favorite routes for the users are extracted and deleted from the DB and UI*/
function removeRoute() {
    const id = [];
    const csrf = $('input[name=csrfmiddlewaretoken]').val();

    /*    console.log($(':checkbox:checked'))*/

    $(':checkbox:checked').each(function (i) {
        id[i] = $(this).val()
        $(this).checked = false;


    })
    if (id.length === 0) {
        swal("You've got to select one (or more) routes first!");
    } else {
        $.ajax({
            url: "/delete_fav_route/",
            method: "POST",
            data: {
                id,
                csrfmiddlewaretoken: csrf
            },
            success: function () {
                for (let i = 0; i < id.length; i++) {
                    $('tr#' + id[i] + '').fadeOut('slow');
                    $('tr#' + id[i] + '').remove();

                }
            }
        })
    }
}

//function that is executed when the remove favorite route button is clicked that shows the alerts
function RemoveFavRouteAlert() {

    swal({
        title: "You sure about this?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Route Removed!", "", "success");
                removeRoute();
            } else {
                swal("Pheew", "Route has not been removed!", "error");
            }
        });
}

