var canvas;
var ctx;

var paddle1, paddle2;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var tempDx, tempDy;

var campaignLevel = 0;
var aiLevel;
var startBall = true;
var hosting = true;
var ticks = 0;
var countdown = [];
var ballUpdateID = 0;

/**
 * Initializes the game in the appropriate mode.
 */
var init = function () {
    'use strict';

    var i, len;

    fetchWordsSync(0);
    canvas = document.getElementById("layer1");
    ctx = canvas.getContext("2d");
    x = canvas.width / 2;
    y = canvas.height / 2;

    paddle1 = new Paddle(50, 200, "ai");
    paddle2 = new Paddle(700, 200, "player");
    switch (mode) {
        case 'campaign':
            endingScore = 3;
            fetchCampaignLevel();
            fetchWordsAsync(campaignLevel);
            aiLevel = (campaignLevel + 1) / 10;

            setPaddles("ai", "player");
            countdown.push("Campaign mode - Level " + campaignLevel);

            break;

        case 'pvp':
            endingScore = 3;
            // try and join a random game
            displayMessage("Searching for a match");
            gamePaused = true;

            if (typeof $.cookie('gameKey') != 'undefined') {
                gameKey = $.cookie('gameKey');
                deleteCookie('gameKey');
            }
            joinGame(gameKey, returnFunc, receiveMessage);

            break;

        case 'challenge':
            initClockDraw();
            aiLevel = 0; //Perfect mode. levels from 1 to 5
            setPaddles("ai", "player");
            gamePaused = false;
            countdown[0] = "Challenge mode";
            break;

        default:
            alert('Invalid Game Mode!');
    }


    if (currentWords.length < 3) {
        len = currentWords.length;
        for (i = 0; i < 3 - len; i += 1) {
            currentWords.push('placeholder');
            updateWords(i);
        }
    }

    if (mode !== 'pvp') {
        resetBall();
    }

    gameLoop();
};

var reset = function () {
    paddle1 = new Paddle(50, 200, "ai");
    paddle2 = new Paddle(700, 200, "player");

    currentWords.length = 0;
    dx = 2, dy = 2;
    changeBallSpeed(dx, dy);
    totalSeconds = 0;
    seconds = "00";
    minutes = "00";

    $('#typing').val('');
    $('#typing').prop('readonly', false);
};

/**
 * Calculates positions where the paddles can move.
 */
var markPositions = function (n) {
    'use strict';

    var i, pos = [];
    for (i = 0; i < n; i += 1) {
        pos.push(canvas.height * (i + 1) / n - canvas.height / (2 * n));
    }
    return pos;
};

/**
 * Set the paddle behaviour: parameters can be "ai", "player" or "remote"
 */
var setPaddles = function (type1, type2) {
    paddle1.playerType = type1;
    paddle2.playerType = type2;
};

/**
 * Resets the ball to the central position. Adds a one second timeout.
 */
var resetBall = function () {
    'use strict';
    tempDx = -dx;
    tempDy = -dy;

    // only send velocity if hosting game
    if (hosting && mode === "pvp") {
        sendMessage(JSON.stringify({
            "type": "ball_reset",
            "dx": tempDx,
            "dy": tempDy
        }));
    }

    startBall = true;
    x = canvas.width / 2;
    y = canvas.height / 2;
    paddle1.update();
    paddle2.update();

    dx = dy = 0;

    var timeout = 1000;
    if (mode === 'pvp') timeout = 1500;
    ballUpdateID = setTimeout(function () {
        console.log("GO");
        displayCountdown();

        dx = tempDx;
        dy = tempDy;

        // send message if player 1
        if (hosting && mode === "pvp") {
            sendMessage(JSON.stringify({
                "type": "ball_update",
                "x": x,
                "y": y,
                "dx": dx,
                "dy": dy,
                "ticks": ticks
            }));
        }

        paddle1.update();
        paddle2.update();

    },timeout);
};

var displayCountdown = function () {
    if (mode === 'pvp') {
        resumeGame();
        return;
    }

    var direction = "";
    if(tempDx > 0){
        direction = direction.concat("right");
    } else {
        direction = direction.concat("left");
    }

    if (tempDy > 0){
        direction = direction.concat("down");
    } else {
        direction = direction.concat("up");
    }

    countdown.push(direction);
    countdown.push("GO!");

    if (gameActive) {
        fadeMessages(countdown);
    }
};

var changeBallSpeed = function (ndx, ndy) {
    dx = ndx; dy = ndy;
};

var stopGame = function () {
    $('#typing').prop('readonly', true);
    clearInterval(intervalId);
    intervalId = 0;
    clearInterval(ballUpdateID);
};

/**
 * Handles game victory. Depending on the mode, functionality and scoring vary.
 */
var winGame = function () {
    'use strict';

    stopGame();
    gameActive = false;
    switch (mode) {
        case 'campaign':
            displayMessage("Good job! You've made it to the next level.");
            updateCampaignLevel(campaignLevel + 1);
            break;

        case 'pvp':
            if (hosting) {
                var returnFunc = function(data) {
                    var strMyChange = String(data.myChange);
                    var strOppChange= String(data.oppChange);
                    if (data.myChange>0)
                        strMyChange = "+"+strMyChange;
                    if (data.oppChange>0)
                        strOppChange = "+"+strOppChange;
                    displayMessage("Victory! \nCurrent ELO: " + data.myELO + "("+strMyChange+")");
                    var messageForOpp = "Better luck next time! \nCurrent ELO: " + data.oppELO + "("+strOppChange+")";
                    sendMessage(JSON.stringify({
                        "type": "display_message",
                        "message": messageForOpp
                    }));
                };
                updatePvPRating($.cookie('user'), returnFunc);
            }
    }
};

/**
 * Handles game loss. Depending on the mode, functionality and scoring vary.
 */
var loseGame = function () {
    'use strict';

    stopGame();
    gameActive = false;
    switch (mode) {
        case 'challenge':
            displayMessage('Survived ' + minutes + 'm and ' + seconds + 's');
            updateChallengeScore(totalSeconds);

            break;
        case 'campaign':
            displayMessage("Too bad. Better luck next time!");
            break;
        case 'pvp':
            if (hosting) {
                var returnFunc = function(data) {
                    var strMyChange = String(data.myChange);
                    var strOppChange= String(data.oppChange);
                    if (data.myChange>0)
                        strMyChange = "+"+strMyChange;
                    if (data.oppChange>0)
                        strOppChange = "+"+strOppChange;
                    displayMessage("Better luck next time! \nCurrent ELO: " + data.myELO + "("+strMyChange+")");
                    var messageForOpp = "Victory! \nCurrent ELO: " + data.oppELO + "("+strOppChange+")";
                    sendMessage(JSON.stringify({
                        "type": "display_message",
                        "message": messageForOpp
                    }));
                };
                updatePvPRating(pvpOpponent, returnFunc);
            }
    }
};

fetchWordsSync(0);
init();
