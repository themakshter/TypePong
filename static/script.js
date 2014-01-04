$(function() {
    // add link to main page
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
