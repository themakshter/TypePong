$(function() {
    /* Login */
    $(".signup-btn").addClass('closed');
    $('#name_field').hide();
    $(".signin-btn").on('click', function(){
        var form = $('form');
        var nameField = $('#name_field');
        var btn = $('#submit_btn');

        nameField.hide();

        $(this).removeClass('closed');
        $(".signup-btn").addClass('closed');
        form.attr('action', '/_verify');
        btn.text('Login');
    });

    $(".signup-btn").on('click', function(){
        var form = $('form');
        var nameField = $('#name_field');
        // var nameField = $('#name_field')
        var btn = $('#submit_btn');

        // nameField.attr('name', 'name');
        nameField.show();

        $(this).removeClass('closed');
        $(".signin-btn").addClass('closed');
        form.attr('action', '/_register');
        btn.text('Register');
    });

});