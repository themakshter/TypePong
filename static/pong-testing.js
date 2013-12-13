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

/*
 * Draws indicating positions where the paddles can move. 
 */
var drawPositions = function (ctx, pos) {
    'use strict';

    var i;
    for (i = 0; i < pos.length; i += 1) {
        ctx.font = "18px Terminator Two";
        ctx.fillStyle = "white";
        ctx.fillText((i + 1).toString(), 650, pos[i]);
    }
};

/*
 * Paddle object
 */
var Paddle = function (xPos, yPos,playerType) {
    'use strict';

    this.xPos = xPos;
    this.yPos = yPos;
    this.reqyPos = yPos;
    this.dy = 2;
    this.width = 20;
    this.height = 85;
    this.score = 0;
    this.playerType = playerType;

    this.hitsHorizontalFace = function (x, y) {
        var startX, endX, startY, endY;
        startX = this.xPos + this.width;
        endX = startX - dx + circle_radius;
        startY = this.yPos - circle_radius;
        endY = this.yPos + this.height + circle_radius;
        return (((x >= startX && x <= endX) || (x <= this.xPos && x >= this.xPos - dx - circle_radius)) && (y >= startY && y <= endY));
    };
    this.hitsVerticalFace = function (x, y) {
        var startX, endX, startY, endY;
        startY = this.yPos + this.height;
        endY = startY - dy + circle_radius;
        startX = this.xPos - circle_radius;
        endX = this.xPos + this.width + circle_radius;
        return (((y >= startY && y <= endY) || (y <= this.yPos && y >= this.yPos - dy - circle_radius)) && (x >= startX && x <= endX));
    };
    this.drawPaddle = function () {
        if (this.reqyPos < 0) {
            this.reqyPos = 0;
        }
        if (this.reqyPos > (canvas_height - this.height)) {
            this.reqyPos = canvas_height - this.height;
        }
        ctx.fillStyle = "#FFFFFF";
        if ((this.dy * (this.yPos - this.reqyPos) < 0)) {
            this.yPos += this.dy;
        }
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
    this.writeScore = function (score_x, score_y) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "75px Terminator Two";
        ctx.fillText(this.score, score_x, score_y, 50);
    };
};
var paddle1 = new Paddle(50, 200,"ai");
var paddle2 = new Paddle(700, 200,"player");

/*
 * Draws the ball.
 */
var circle = function (x, y, r) {
    'use strict';

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
};

/*
 * Draws the canvas and the paddles.
 */
var rect = function (x, y, w, h) {
    'use strict';

    var i, small_x, small_width;
    small_x = 370;
    small_width = 10;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    paddle1.drawPaddle();
    paddle1.writeScore(305, 75);
    paddle2.drawPaddle();
    paddle2.writeScore(400, 75);
    for (i = 5; i < 500; i += 30) {
        ctx.fillRect(small_x, i, small_width, small_width);
    }
};

/*
 * Resets the ball to the central position. Adds a 1-second pause.
 */
var resetBall = function () {
    'use strict';
    start_ball = true;
    var tempX, tempY;
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

/*
 * Clears the screen.
 */
var clear = function () {
    'use strict';

    ctx.clearRect(0, 0, canvas_width, canvas_height);
};

/*
 * AI - 22/11/13
 */
var calculateHitYPos = function(ball_x,ball_y,dx,dy,paddle_x){
    var yPos = y + Math.abs(((x - (paddle_x + 20)) / dx)) * dy;
    while (yPos< 0 || yPos > canvas_height) {
        if (yPos > canvas_height) {
            yPos = canvas_height - (yPos - canvas_height);
        } else if (yPos < 0) {
            yPos *= -1;
        }
    }
    return yPos;
};


var tryAndMove = function(paddle) {
        if(((x < paddle.xPos) && (dx > 0)) || (x > paddle.xPos) && (dx < 0)){
            var yPos = calculateHitYPos(x,y,dx,dy,paddle.xPos);
        }
        sample_size = aiLevel * 10;
        var speed = Math.abs(paddle.dy);
        var number;
        if (start_ball) {
            number = 6;
            start_ball = false;
        } else {
            number = Math.round(Math.random() * sample_size);
        }
        if (number <= 5 && paddle.playerType === "ai") {
            // speed = -speed;
            yPos = canvas_height - yPos;
        }
        paddle.dy = yPos < paddle.yPos ? -speed : speed;
        paddle.reqyPos = Math.round(yPos - (paddle.height / 2));

    };

//[TODO]
/*
 * Handles game victory. Depending on the mode, functionality and scoring vary.
 */
var winGame = (function () {
    'use strict';

    //window.clearInterval(intervalID);

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
}());

//[TODO]
/*
 * Handles game loss. Depending on the mode, functionality and scoring vary.
 */
var loseGame = function () {
    'use strict';

    //window.clearInterval(intervalID);
    //alert("Tough Luck! Better luck next time!");
    /*
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Terminator Two";
    ctx.fillText("Too bad. Better luck next time!", canvas_width / 3, 2 * canvas_height / 3);
    */
};

/*
 * Draws all graphical elements.
 */
var draw = function () {
    'use strict';

    clear();
    ctx.fillStyle = "#000000";
    rect(0, 0, canvas_width, canvas_height);
    ctx.fillStyle = "#FFFFFF";
    circle(x, y, circle_radius);

    var pos = markPositions(3);
    drawPositions(canvas, ctx, pos);

    if (paddle1.score >= endingScore) {
        loseGame();
        return;
    } else if (paddle2.score >= endingScore) {
        winGame();
        return;
    }

    if (paddle1.hitsHorizontalFace(x + dx, y + dy) || paddle2.hitsHorizontalFace(x + dx, y + dy)) {
        dx = -dx;
        tryAndMove(paddle1);
    } else if (y + dy + circle_radius > canvas_height || y + dy - circle_radius < 0 || paddle1.hitsVerticalFace(x + dx, y + dy) || paddle2.hitsVerticalFace(x + dx, y + dy)) {
        dy = -dy;
       tryAndMove(paddle1);
    } else if (x + dx + circle_radius > canvas_width) {
        paddle1.score += 1;
        dx = -dx;
        resetBall();
    } else if (x + dx - circle_radius < 0) {
        paddle2.score += 1;
        dx = -dx;
        resetBall();
    }
    x += dx;
    y += dy;
};

/*
 * Initializes the game in the appropriate mode.
 */
var init = function () {
    'use strict';

    var i;
    mode = fetchMode(); // Fetches game mode from the server.
    endingScore = 10;
    canvas = document.getElementById("canvas");
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    ctx = canvas.getContext("2d");
    x = x_startPos;
    y = y_startPos;

    switch (mode) {
        case 'campaign':
            var level;
            level = fetchLevel();
            //[TODO] : 1. Set length of words in sampler.py according to level.
            //[TODO] : 2. Set AI difficulty level accordingly. Make AI correspond to levels.
            aiLevel = 1;
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
    intervalID = setInterval(draw, 10);
};

/*
 * Typing Listener; handles word colouring and paddle movement.
 */
window.onkeyup = (function () {
    'use strict';
    var i, typeElem, pos, newyPos;

    typeElem = $('#typing');
    pos = markPositions(3);

    return function () {
        var typed, typedLC, currentWordLC;
        typed = typeElem.val();
        typedLC = typed.toLowerCase();

        for (i = 0; i < currentWords.length; i += 1) {
            currentWordLC = currentWords[i].toLowerCase();
            if (typedLC === currentWordLC.substring(0, typed.length) && typed) {
                updateColor(i, 'green');
            } else if (typed.length > 1 && typedLC.substring(0, typed.length - 1) === currentWordLC.substring(0, typed.length - 1)) {
                updateColor(i, 'red');
            } else if (!typed) {
                resetAllColors();
            }

            if (typedLC === currentWordLC) {
                var ballYPos = calculateHitYPos(x,y,dx,dy,paddle2.xPos);
                var speed = Math.abs(paddle2.dy);
                var startSeg = canvas_height * (i/pos.length);
                var endSeg   = canvas_height * ((i+1)/pos.length);
                newyPos = pos[i] - paddle2.height / 2;         
                if(ballYPos > startSeg && ballYPos < endSeg){
                    tryAndMove(paddle2);
                }else{
                    paddle2.dy = newyPos < paddle2.yPos ? -speed : speed;
                    paddle2.reqyPos = Math.round(newyPos);
                }
                typeElem.val('');
                updateWords(i);
                resetAllColors();
            }
        }
    };
}());

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