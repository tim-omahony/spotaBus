function remove_route() {
    const id = [];
    const csrf = $('input[name=csrfmiddlewaretoken]').val();
    $(':checkbox:checked').each(function (i) {
        id[i] = $(this).val()
    })
    if (id.length === 0) {
        swal("You gotta select one (or more) first!");
    } else {
        console.log(id)
        $.ajax({
            url: "/delete_fav_route/",
            method: "POST",
            data: {
                id,
                csrfmiddlewaretoken: csrf
            },
            success: function (response) {
                for (let i = 0; i < id.length; i++) {
                    /*  $('tr#'+id[i]+'').css('background-color');*/
                    $('tr#' + id[i] + '').fadeOut('slow');
                }
            }
        })
    }
}

function RemoveFavRouteAlert() {
    swal({
        title: "You sure about this?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Favourite Route Removed!", "", "success");
                remove_route();
            } else {
                swal("Pheew", "Route has not been removed!", "error");
            }
        });
}


// //still working on this
// $(function () {
//     var tbl = document.getElementById("tbody").rows.length;
//     console.log(tbl)
//     if (tbl.rows.length == 0) {
//         document.getElementById('delete_btn').style.visibility = 'hidden';
//     } else {
//         document.getElementById('delete_btn').style.visibility = 'visible';
//     }
// })
