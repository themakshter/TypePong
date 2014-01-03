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

var pvpOpponent =0;

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
            //[TODO] : 1. Set length of words in sampler.py according to level.
            //[TODO] : 2. Set AI difficulty level accordingly. Make AI correspond to levels.
            endingScore = 3;
            fetchCampaignLevel();
            fetchWordsAsync(campaignLevel);
            aiLevel = 1;

            setPaddles("ai", "player");
            countdown[0] = "Campaign mode - Level " + campaignLevel;
            countdown[1] = "3";
            countdown[2] = "2";
            countdown[3] = "1";
            countdown[4] = "GO!";
            fadeMessages(countdown);

            break;

        case 'pvp':
            var returnFunc = function(data) {
                if (!data.game_found) {
                    // if no game found, create a game instead
                    createGame(function() {}, receiveMessage);
                    hosting = true;
                    setPaddles("remote", "player");
                    hideMessage();
                    displayMessage("Waiting.. No players online");
                    gamePaused = true;
                } else {
                    if (data.opponent){
                        pvpOpponent = data.opponent;
                        hideMessage();
                        hosting = false;
                        setPaddles("player", "remote");
                        ticks = 0;
                        gamePaused = false;
						countdown[0] = "Pvp mode";
                        resetBall();
                    }else{
                        alert("Error, missing opponent");
                    }
                }
            }
            endingScore = 1;//TODO
            // try and join a random game
            displayMessage("Searching for a match");
            gamePaused = true;
            joinGame("", returnFunc, receiveMessage);

            break;

        case 'challenge':
            initClockDraw();
            aiLevel = 0; //Perfect mode. levels from 1 to 5
            setPaddles("ai", "player");
            gamePaused = false;
            countdown[0] = "Challenge mode";
            break;

        case 'custom':
            //[TODO] Optional Mode
            setPaddles("ai", "player");
            gamePaused = false;
            countdown[0] = "Custom mode";

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
 * Receive a message from another player
 */
var receiveMessage = function (message) {
    console.log("receive " + message.data);

    var data = JSON.parse(message.data);

    switch(data.type) {
        case 'join':
            // hide waiting message and resume game
            hideMessage();
            ticks = 0;
            gamePaused = false;
            resetBall();
            break;
        case 'paddle_move':
            if (paddle1.playerType === "remote") {
                paddle1.moveTo(data.destY);
            } else {
                paddle2.moveTo(data.destY);
            }
            break;
        case 'ball_update':
            dx = data.dx;
            dy = data.dy;
            x = data.x + dx * (ticks - data.ticks);
            y = data.y + dy * (ticks - data.ticks);
            break
        case 'ball_reset':
                tempDx = data.dx;
                tempDy = data.dy;
                break;
        case 'score_change':
                paddle1.score = data.score1;
                paddle2.score = data.score2;
                break
        case 'display_message'://Used to display score changes etc
            displayMessage(data.message);
    }
}

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
}

/**
 * Resets the ball to the central position. Adds a one second timeout.
 */
var resetBall = function () {
    'use strict';

    startBall = true;
    x = canvas.width / 2;
    y = canvas.height / 2;
    paddle1.update();
    paddle2.update();

    // only choose velocity if singleplayer or hosting
    if (hosting || mode !== "pvp") {
        // choose velocity here
        tempDx = -dx;
        tempDy = -dy;

        if (mode === "pvp") {
            sendMessage(JSON.stringify({
                "type": "ball_reset",
                "dx": tempDx,
                "dy": tempDy
            }));
        }
    }

    dx = dy = 0;

    ballUpdateID = setTimeout(function () {
        dx = tempDx;
        dy = tempDy;
        paddle1.update();
        paddle2.update();

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
    }, countdown.length * 1000);
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

//[TODO]
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
            if (pvpOpponent){
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

                    // alert("woow");
                };
                updatePvPRating(pvpOpponent, pvpOpponent, returnFunc);

            }
    }
};

//[TODO]
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
            //TODO: maybe write some useful stats (like how many words typed)
            break;
        case 'pvp':
            //TODO: as with winGame()
    }
};

fetchWordsSync(0);
init();
