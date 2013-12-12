$(function() {
    // Login form
    var form = $('form');

    /* On submit do ajax request.
     * Redirect if successful else show errors
     */ 
    form.submit(function (event) {
        // Stop form from submitting normally

        event.preventDefault();

        var url = form.attr("action");
        values = {
            username: form.find("input[name='username']").val(),
            // detail: form.find("input[name='detail']").val(),
            pass: form.find("input[name='pass']").val(),
        };

        var completeFunc = function(data) {
            if (data.success === "true") {
                window.location.href = "/game";
            }
            console.log(data.username_error);
            console.log(data.password_error);
            function setText(div, text) {
                if(typeof text === "undefined")
                    div.text("");
                else
                    div.text(text);
            }
            setText($("#username_error"), data.username_error);
            setText($("#password_error"), data.password_error);
        };
        
        $.post(url, values, completeFunc).fail(function(xhr, ajaxOptions, thrownError){console.log(thrownError)});
    });

    /* This is for switching css and toggling the name
     * field when clicking between register and login
     */
    form.attr('action', '/_login');
    $('#name_field').hide();
    $(".signin-btn").on('click', function(){
        var nameField = $('#name_field');
        var btn = $('#submit_btn');

        nameField.hide();

        $(this).removeClass('closed');
        $(".signup-btn").addClass('closed');
        form.attr('action', '/_login');
        btn.text('Login');
    });

    $(".signup-btn").on('click', function(){
        var nameField = $('#name_field');
        var btn = $('#submit_btn');

        // nameField.show();

        $(this).removeClass('closed');
        $(".signin-btn").addClass('closed');
        form.attr('action', '/_register');
        btn.text('Register');
    });

    $("#main").click(function(){window.location.href = "/";});

    $("#name").text("Hi " + $.cookie("name"));

    // add tooltips
    $(document).tooltip({
        track: true
    });
    
});