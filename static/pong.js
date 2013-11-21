var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var canvas_width = 750;
var canvas_height = 500;
var x_startPos = 200;
var y_startPos = 0;
var circle_radius = 10;
var wordList = [];
var currentWords = [];

var updateWords = function (id) {
    'use strict';

    if (wordList.length === 0) {
        fetchWords();
    }
    currentWords[id] = wordList.pop();
    var p_id = '#current_' + id;
    $(p_id).html((id + 1) + ": " + currentWords[id]);
};

var colorify = function (s, color) {
    'use strict';

    s = s.replace(/<span[^>]+>([^<>\s]+)<\/span>/, "$1");
    return '<span style="color: ' + color +
        '">' + s + '</span>';
};

var updateColor = function (id, color) {
    'use strict';

    var p_id = '#current_' + id;
    $(p_id).html((id + 1) + ": " + colorify(currentWords[id], color));
};

var resetAllColors = function () {
    'use strict';

    var id;
    for (id = 0; id < currentWords.length; id += 1) {
        updateColor(id, 'black');
    }
};

var markPositions = function (n) {
    'use strict';

    var i, pos = [];
    for (i = 0; i < n; i += 1) {
        pos.push(canvas_height * (i + 1) / n - canvas_height / (2 * n));
    }
    return pos;
};

var drawPositions = function (ctx, pos) {
    'use strict';

    var i;
    for (i = 0; i < pos.length; i += 1) {
        ctx.font = "18px Terminator Two";
        ctx.fillStyle = "white";
        ctx.fillText((i + 1).toString(), 650, pos[i]);
    }
};

var Paddle = function (xPos, yPos) {
    'use strict';

    this.xPos = xPos;
    this.yPos = yPos;
    this.reqyPos = yPos;
    this.dy = 1;
    this.width = 20;
    this.height = 85;
    this.score = 0;

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
        return (((y >= startY && y <= endY) || (y <= this.yPos && y >= this.yPos - dy - circle_radius)) && (x >= startX && y <= endX));
    };
    this.drawPaddle = function () {
        ctx.fillStyle = "#FFFFFF";
        if (this.dy * (this.yPos - this.reqyPos) < 0) {
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
var paddle1 = new Paddle(50, 200);
var paddle2 = new Paddle(700, 200);

var circle = function (x, y, r) {
    'use strict';

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
};

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

var resetBall = function () {
    'use strict';

    var tempX, tempY;
    x = canvas_width / 2;
    y = canvas_height / 2;
    tempX = dx;
    tempY = dy;
    dx = dy = 0;
    setTimeout(function () {
        dx = tempX;
        dy = tempY;
    }, 1000);
};

var clear = function () {
    'use strict';

    ctx.clearRect(0, 0, canvas_width, canvas_height);
};

var draw = function () {
    'use strict';

    clear();
    ctx.fillStyle = "#000000";
    rect(0, 0, canvas_width, canvas_height);
    ctx.fillStyle = "#FFFFFF";
    circle(x, y, circle_radius);

    var pos = markPositions(3);
    drawPositions(canvas, ctx, pos);

    if (paddle1.hitsHorizontalFace(x + dx, y + dy) || paddle2.hitsHorizontalFace(x + dx, y + dy)) {
        dx = -dx;
    } else if (y + dy + circle_radius > canvas_height || y + dy - circle_radius < 0 || paddle1.hitsVerticalFace(x + dx, y + dy) || paddle2.hitsVerticalFace(x + dx, y + dy)) {
        dy = -dy;
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

var init = function () {
    'use strict';

    var i;
    canvas = $("#canvas")[0];
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    ctx = canvas.getContext("2d");
    x = x_startPos;
    y = y_startPos;

    for (i = 0; i < 3; i += 1) {
        currentWords.push('placeholder');
        updateWords(i);
    }
    return setInterval(draw, 10);
};

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
                newyPos = pos[i] - paddle2.height / 2;
                paddle2.dy = newyPos < paddle2.yPos ? -2 : 2;
                paddle2.reqyPos = Math.round(newyPos);
                typeElem.val('');
                updateWords(i);
                resetAllColors();
            }
        }
    };
}());

var fetchWords = (function () {
    'use strict';
    var currentLevel, scriptRoot;
    currentLevel = 0;
    scriptRoot = '/';

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

fetchWords();
init();