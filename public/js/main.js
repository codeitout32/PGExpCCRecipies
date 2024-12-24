$(document).ready(function(){
    console.log('script loading')
    $('.delete-recipe').on('click',function() {
    console.log('script clicked')

        var id = $(this).data('id');
        var url = '/delete/'+id;
        if(confirm('Delete Recipe?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Recipe...');
                    window.location.href='/';

                },
                error: function(err){
                    console.log(err);
                }
            })
        }
    })
    $('.edit-recipe').on('click', function(){
        // debugger
        $('#edit-form-name').val($(this).data('name'));
        $('#edit-form-ingredients').val($(this).data('ingredients'));
        $('#edit-form-directions').val($(this).data('directions'));
        $('#edit-form-id').val($(this).data('id'));
    })
})