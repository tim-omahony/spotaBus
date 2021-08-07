

$(document).ready(function(){
    $('#delete_btn').click(function(){
        if(confirm("Are you sure you want to delete this routes?"))    {
            var id = [];
            var csrf = $('input[name=csrfmiddlewaretoken]').val();
            $(':checkbox:checked').each(function(i){
                id[i]=$(this).val()
            })
            if(id.length===0){
                alert("please select route(s) to delete")
            }else{
                console.log(id)
                $.ajax({
                    url: ".",
                    method: "POST",
                    data: {
                        id,
                        csrfmiddlewaretoken:csrf
                    },
                    success:function(response){
                        for(var i=0; i < id.length; i++){
                          /*  $('tr#'+id[i]+'').css('background-color');*/
                            $('tr#'+id[i]+'').fadeOut('slow');
                        }
                    }
                })
            }
        }
    }  )
})