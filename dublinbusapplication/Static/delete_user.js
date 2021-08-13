$(document).ready(function () {
    $("#del_user_btn").click(function () {
        if (confirm("Are you sure you want to delete your user?")) {
            var user_id = $(this).val();
            alert(user_id);

            $.ajax({
                url: "delete_user/",
                method: "POST",
                data: {
                    user_id : user_id,
                    csrfmiddlewaretoken
                },
                success: function (response) {
                    console.log('success', response)
                    alert("user successfully deleted from the database!")
                }
            })
        }
    });
})