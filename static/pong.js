var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var canvas_width = 750;
var canvas_height = 500;
var x_startPos = 350;
var y_startPos = 350;
var circle_radius = 10;
var wordList = [];
var currentWords = [];
var endingScore;
var intervalID;
var mode;
var aiLevel;
var oldTime;
var newTime;
var start_ball = true;


/*
 * Initializes the game in the appropriate mode.
 */
var init = function () {
    'use strict';

    var i;
    mode = fetchMode(); // Fetches game mode from the server.
    endingScore = 11;
    canvas = document.getElementById("layer1");
    ctx = canvas.getContext("2d");
    x = x_startPos;
    y = y_startPos;

    initClockDraw();

    switch (mode) {
        case 'campaign':
            //[TODO] : 1. Set length of words in sampler.py according to level.
            //[TODO] : 2. Set AI difficulty level accordingly. Make AI correspond to levels.
            break;

        case 'pvp':
            //[TODO]
            break;

        case 'challenge':
            //[TODO] Increase difficulty over time.
            oldTime = new Date(); //Used to calculate the score.
            aiLevel = 0; //Perfect mode. levels from 1 to 5 or
            //whatever will increase in terms of ai perfection
            endingScore = Number.MAX_VALUE; //Infinity.
            break;

        case 'custom':
            //[TODO] Optional Mode
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

/*
 * Updates the word of the given position id.
 */
var updateWords = function (id) {
    'use strict';

    if (wordList.length === 0) {
        fetchWords();
    }
    currentWords[id] = wordList.pop();
    var p_id = '#current_' + id;
    $(p_id).html((id + 1) + ": " + currentWords[id]);
};

/*
 * Returns the coloured version of the given string in HTML form.
 */
var colorify = function (s, color) {
    'use strict';

    s = s.replace(/<span[^>]+>([^<>\s]+)<\/span>/, "$1");
    return '<span style="color: ' + color +
        '">' + s + '</span>';
};

/*
 * Updates the colour of a specific word or substring.
 */
var updateColor = function (id, color) {
    'use strict';

    var p_id = '#current_' + id;
    $(p_id).html((id + 1) + ": " + colorify(currentWords[id], color));
};

/*
 * Resets the colours of all words to black.
 */
var resetAllColors = function () {
    'use strict';

    var id;
    for (id = 0; id < currentWords.length; id += 1) {
        updateColor(id, 'black');
    }
};

/*
 * Calculates positions where the paddles can move.
 */
var markPositions = function (n) {
    'use strict';

    var i, pos = [];
    for (i = 0; i < n; i += 1) {
        pos.push(canvas_height * (i + 1) / n - canvas_height / (2 * n));
    }
    return pos;
};

var paddle1 = new Paddle(50, 200,"ai");
var paddle2 = new Paddle(700, 200,"player");

/*
 * Resets the ball to the central position. Adds a 1-second pause.
 */
var resetBall = function () {
    'use strict';

    var tempX, tempY;

    start_ball = true;
    x = canvas_width / 2;
    y = canvas_height / 2;
    tempX = dx;
    tempY = dy;
    tryAndMove(paddle1);
    dx = dy = 0;
    setTimeout(function () {
        dx = tempX;
        dy = tempY;
    }, 1000);
};

//[TODO]
/*
 * Handles game victory. Depending on the mode, functionality and scoring vary.
 */
var winGame = function () {
    'use strict';

    gameActive = false;

    canvas.style.webkitFilter = "blur(3px) brightness(0.2)";
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = "#FFFFFF";
    loseString = "Good job!";
    loseWidth = ctx2.measureText(loseString).width;

    ctx2.fillText(loseString, (canvas.width / 2) - (loseWidth / 2),
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
/*
 * Handles game loss. Depending on the mode, functionality and scoring vary.
 */
var loseGame = function () {
    'use strict';
    var loseString, loseWidth, loseHeight, layer2, ctx2;

    gameActive = false;

    canvas.style.webkitFilter = "blur(3px) brightness(0.2)";
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = "#FFFFFF";
    loseString = "Too bad. Better luck next time!";
    loseWidth = ctx2.measureText(loseString).width;

    ctx2.fillText(loseString, (canvas.width / 2) - (loseWidth / 2),
            canvas.height / 2);
};

/*
 * Fetches the list of words.
 */
var fetchWords = (function () {
    'use strict';
    var currentLevel, scriptRoot;
    currentLevel = 0;
    scriptRoot = 'http://mystical-hawk-370.appspot.com/';

    return function () {
        $.ajax({
            url: scriptRoot + '_loadwords',
            async: false,
            data: {
                level: currentLevel
            },
            dataType: 'json',
            success: function (data) {
                currentLevel += 1;
                $.each(data, function (key, val) {
                    wordList.push(val);
                });
            }
        });
    };
}());

// [TODO]
/*
 * Fetches the game mode from the server (campaign, pvp, custom etc.)
 */
var fetchMode = (function () {
    'use strict';
    return 'campaign';
});

//[TODO]
/*
 * Fetches level for campaign mode. Used only in campaign mode.
 */
var fetchLevel = (function () {
    'use strict';
    return 1;
});

fetchWords();
init();
