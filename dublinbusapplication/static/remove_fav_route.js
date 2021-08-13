
/*function that is executed when the delete button is clicked with the checkboxes filled out.
* The IDs of favorite routes for the users are extracted and deleted from the DB and UI*/
$(document).ready(function () {
    $('#delete_btn').click(function () {
        if (confirm("Are you sure you want to delete this routes?")) {
            const id = [];
            const csrf = $('input[name=csrfmiddlewaretoken]').val();
            $(':checkbox:checked').each(function (i) {
                id[i] = $(this).val()
            })
            if (id.length === 0) {
                alert("please select route(s) to delete")
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
    })
})