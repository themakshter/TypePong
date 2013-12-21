var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var aiLevel;
var startBall = true;
var hosting = true;
var ticks = 0;

var color = "#FFFFFF";


/**
 * Initializes the game in the appropriate mode.
 */
var init = function () {
    'use strict';

    var i;
    canvas = document.getElementById("layer1");
    ctx = canvas.getContext("2d");
    x = canvas.width / 2;
    y = canvas.height / 2;

    switch (mode) {
        case 'campaign':
            //[TODO] : 1. Set length of words in sampler.py according to level.
            //[TODO] : 2. Set AI difficulty level accordingly. Make AI correspond to levels.
            setPaddles("ai", "player");
            break;

        case 'pvp':
            //[TODO]

            var returnFunc = function(data) {
                if (!data.game_found) {
                    // if no game found, create a game instead
                    createGame(function() {}, receiveMessage);
                    hosting = true;
                    setPaddles("remote", "player");
                    displayMessage("Waiting for player");
                } else {
                    hosting = false;
                    setPaddles("player", "remote");
                }
            }

            // try and join a random game
            joinGame("", returnFunc, receiveMessage);

            break;

        case 'challenge':
            initClockDraw();
            aiLevel = 0; //Perfect mode. levels from 1 to 5
            setPaddles("ai", "player");
            break;

        case 'custom':
            //[TODO] Optional Mode
            setPaddles("ai", "player");
            break;

        default:
            alert('Invalid Game Mode!');
    }


    for (i = 0; i < 3; i += 1) {
        currentWords.push('placeholder');
        updateWords(i);
    }

    gameLoop();
};

/**
 * Receive a message from another player
 */
var receiveMessage = function (message) {
    //[TODO] : Actually deal with messages
    console.log("receive " + message.data);

    var data = JSON.parse(message.data);

    switch(data.type) {
        case 'join':
            // hide waiting message and resume game
            hideMessage();
            break;
        case 'paddle_move':
            if (paddle1.playerType === "remote") {
                paddle1.moveTo(data.dest_y);
            } else {
                paddle2.moveTo(data.dest_y);
            }
            break;
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

var paddle1 = new Paddle(50, 200, "ai");
var paddle2 = new Paddle(700, 200, "player");

/**
 * Set the paddle behaviour: parameters can be "ai", "player" or "remote"
 */
var setPaddles = function (type1, type2) {
    paddle1.playerType = type1;
    paddle2.playerType = type2;
}

/**
 * Resets the ball to the central position. Adds a 1-second pause.
 */
var resetBall = function () {
    'use strict';

    var tempX, tempY;

    startBall = true;
    x = canvas.width / 2;
    y = canvas.height / 2;
    tempX = dx;
    tempY = dy;
    paddle1.update();
    paddle2.update();
    dx = dy = 0;
    setTimeout(function () {
        dx = tempX;
        dy = tempY;
    }, 1000);
};

/**
 * Pauses the game and displays a message.
 */
var displayMessage = function (message) {
    'use strict';
    var msgWidth, layer2, ctx2;

    gamePaused = true;

    $(canvas).addClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = color;
    msgWidth = ctx2.measureText(message).width;

    ctx2.fillText(message, (canvas.width / 2) - (msgWidth / 2),
            canvas.height / 2);
}

/**
 * Hide displayed message and resume game.
 */
var hideMessage = function() {
    'use strict';
    var layer2, ctx2;

    ticks = 0;
    gamePaused = false;

    $(canvas).removeClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.clearRect(0, 0, layer2.width, layer2.height);
}

//[TODO]
/**
 * Handles game victory. Depending on the mode, functionality and scoring vary.
 */
var winGame = function () {
    'use strict';
    gameActive = false;
    displayMessage("Good job!");

    //Each mode has a different victory result / score.
    switch (mode) {
        case 'campaign':
            //Update Level / maybe time
            break;

        case 'pvp':
            //Update Win / Loss ratio
            break;

        case 'custom':
            //[TODO] Optional Mode - who cares.
            break;
    }
};

//[TODO]
/**
 * Handles game loss. Depending on the mode, functionality and scoring vary.
 */
var loseGame = function () {
    'use strict';
    gameActive = false;
    displayMessage("Too bad. Better luck next time!");

    switch (mode) {
        case 'challenge':
            //TODO: replace this with an on-screen message
            alert('Survived ' + minutes + 'm and ' + seconds + 's');
            break;
        case 'campaign':
            //TODO: maybe write some useful stats (like how many words typed)
            break;
        case 'pvp':
            //TODO: as with winGame()
    }
};

//[TODO]
/**
 * Fetches level for campaign mode. Used only in campaign mode.
 */
var fetchLevel = (function () {
    'use strict';
    return 1;
});

fetchWords();
init();
