window.fbAsyncInit = function() {
    FB.init({
        appId      : '203715726482941',
        status     : true,
        cookie     : true,
        xfbml      : true,
        oauth      : true
    });
    // FB.Event.subscribe('auth.login', function(response) {
    //     handleResponse(response);
    //     window.location.reload(); // reload if not redirected
    // });

    // function handleResponse(response){
    //     'use strict'
    //     if (response.status ==='connected'){
    //         var id =response.authResponse.userID;
    //         window.location.href = "_facebookLogin?facebookID=" + id;
    //     }
    // }

    // FB.getLoginStatus(handleResponse);
};

function fbLogin(){
    console.log("func call");
    FB.login(function(response) {
            console.log(response);
        if (response.authResponse) {
            //access_token = response.authResponse.accessToken; //get access token
            window.location.href = "_facebookLogin?facebookID=" + response.authResponse.userID;
        }
    }, {
        scope: 'publish_stream,email'
    });

}

// (function(d){
//     var js, id = 'facebook-jssdk';
//     if (d.getElementById(id)) {
//         return;
//     }
//     js = d.createElement('script');
//     js.id = id;
//     js.async = true;
//     js.src = "https://connect.facebook.net/en_US/all.js";
//     d.getElementsByTagName('head')[0].appendChild(js);
// }(document));

(function() {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());

(function addFacebookLoginOnClick() {
    'use strict';
    var button = $('#fb_btn');
    console.log("add click");
    button.click(function(){
        console.log("click");
        fbLogin();
    });
}());