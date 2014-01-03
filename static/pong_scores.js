var updateScore = function (score) {
    var data = { "hiScore" : score, "username" : $.cookie('user') };

    $.post('/_updatescore', data);
};

var updateChallengeScore = function (time) {
    var data = { "timeSurvived" : time, "username" : $.cookie('user') };

    $.post('/_updatechallengescore', data);
};

var updateCampaignLevel = function (level) {
    var data = { "campaignLevel" : level, "username" : $.cookie('user') };

    $.post('/_updatecampaignlevel', data);
};

var updatePvPRating = function (otherUser, winner) {
    var data = {  "username" : $.cookie('user'), "pvpRating" : $.cookie('ELO'),
        "winner" : winner, "oppositionUsername": otherUser };
        alert(otherUser);

    $.post('/_updatepvprating', data);
};

var fetchCampaignLevel = function () {
    $.ajax({
        url: '/_loadcampaignlevel',
        async: false,
        data: {
            "username": $.cookie('user')
        },
        dataType: 'json',
        success: function (data) {
            campaignLevel = data[0];
        }
    });
};
