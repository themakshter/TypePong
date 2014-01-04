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
        window.location.reload(); // reload if not redirected
    });

    function handleResponse(response){
        'use strict'
        if (response.status ==='connected'){
            var id =response.authResponse.userID;
            window.location.href = "_facebookLogin?facebookID=" + id;
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