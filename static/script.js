$(function() {
    /* Login */
    $(".signup-btn").addClass('closed');
    $('#name_field').hide();
    $(".signin-btn").on('click', function(){
        var form = $('form');
        var emailField = $('#name_field');
        var btn = $('#submit_btn');

        emailField.hide();

        $(this).removeClass('closed');
        $(".signup-btn").addClass('closed');
        form.attr('action', '/login');
        btn.text('Login');
    });

    $(".signup-btn").on('click', function(){
        var form = $('form');
        var emailField = $('#name_field');
        var btn = $('#submit_btn');

        emailField.show();

        $(this).removeClass('closed');
        $(".signin-btn").addClass('closed');
        form.attr('action', '/register');
        btn.text('Register');
    });

});