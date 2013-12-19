var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var xStartPos = 350;
var yStartPos = 350;
var aiLevel;
var startBall = true;
var hosting = true;

var color = "#FFFFFF";


/**
 * Initializes the game in the appropriate mode.
 */
var init = function () {
    'use strict';

    var i;
    canvas = document.getElementById("layer1");
    ctx = canvas.getContext("2d");
    x = xStartPos;
    y = yStartPos;

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
        case 'paddle_move':
            if (paddle1.playerType === "remote") {
                paddle1.moveTo(data.dest_y);
            } else {
                paddle2.moveTo(data.dest_y);
            }
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

var blurCanvas = function() {
    'use strict';

    $(canvas).addClass("pongblur");
}

//[TODO]
/**
 * Handles game victory. Depending on the mode, functionality and scoring vary.
 */
var winGame = function () {
    'use strict';
    var winString, winWidth, layer2, ctx2;

    gameActive = false;

    blurCanvas();
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = color;
    winString = "Good job!";
    winWidth = ctx2.measureText(winString).width;

    ctx2.fillText(winString, (canvas.width / 2) - (winWidth / 2),
            canvas.height / 2);

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
    var loseString, loseWidth, layer2, ctx2;

    gameActive = false;

    blurCanvas();
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = color;
    loseString = "Too bad. Better luck next time!";
    loseWidth = ctx2.measureText(loseString).width;

    ctx2.fillText(loseString, (canvas.width / 2) - (loseWidth / 2),
            canvas.height / 2);

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
