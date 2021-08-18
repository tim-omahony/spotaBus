//function that takes the user id and removes it from the database
function removeUser(user_id) {

    $.ajax({
        url: "delete_user/",
        method: "POST",
        data: {
            user_id: user_id,
            csrfmiddlewaretoken
        },
        success: function () {
            alert("user successfully deleted!")
        }
    })
    changePage()
}

//Function to change page once the user is deleted
function changePage() {
    location.replace("http://127.0.0.1:8000/")
}

//function to show alerts when delete user button is clicked
function removeUserAlert() {
    let user_id = document.getElementById("del_user_btn").value;
    swal({
        title: "You sure about this?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("User is deleted!", "", "success");
                removeUser(user_id);
            } else {
                swal("Pheew", "User has not been deleted!", "error");
            }
        });
}
