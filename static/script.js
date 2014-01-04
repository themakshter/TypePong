$(function() {
    'use strict';
    // Login form
    var form = $('form');
    var loginButton = $('#login_btn');
    var registerButton = $('#register_btn');
    addLoginOnClick(loginButton, "/_login");
    addLoginOnClick(registerButton, "/_register");
    form.submit(
        function(event) {
            event.preventDefault();
            return false;
        }
    );

    function addLoginOnClick(button, url) {
        'use strict';
        button.click(function() {
            var values = {
                username: form.find("input[name='username']").val(),
                pass: form.find("input[name='pass']").val(),
            };

            var completeFunc = function(data) {
                if (data.success === "true") {
                    window.location.href = "/campaign";
                }
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
    }

    $("#main").click(function(){window.location.href = "/";});

    // add tooltips
    $(document).tooltip({
        track: true,
        items: "[tooltip]",
        content: function() {
            return $(this).attr("tooltip");
        }
    });

});
