window.fbAsyncInit = function() {
    FB.init({
        appId      : '203715726482941',
        status     : true,
        cookie     : true,
        xfbml      : true,
        oauth      : true
    });
    FB.Event.subscribe('auth.login', function(response) {
        handleResponse(response);
    });

    function handleResponse(response){
        'use strict'
        if (response.status === 'connected'){
            var id =response.authResponse.userID;
            var url = "_facebookLogin?facebookID=" + id;

            var completeFunc = function(data) {
                if (data.success === "true") {
                    window.location.href = "/campaign";
                } else {
                    window.location.href = "_getUsername?facebookID=" + id;
                }
            };

            $.get(url, completeFunc).fail(function(xhr, ajaxOptions, thrownError){console.log(thrownError)});
        }
    }

    FB.getLoginStatus(handleResponse);
};

(function(d){
    var js, id = 'facebook-jssdk';
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "https://connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));