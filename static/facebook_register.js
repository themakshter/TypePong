$(function() {
    'use strict';
    // Login form
    var form = $('form');
    var registerButton = $('#register_btn');
    addLoginOnClick(registerButton, "/_facebookRegister");
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
                facebookID: form.find("input[name='facebookID']").val(),
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
                setText($("#error"), data.username_error);
                setText($("#password_error"), data.password_error);
            };

            $.post(url, values, completeFunc).fail(function(xhr, ajaxOptions, thrownError){console.log(thrownError)});
        });
    }
});