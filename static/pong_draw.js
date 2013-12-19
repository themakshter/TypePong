/**
 * Draws the ball.
 */
var circle = function (x, y, r) {
    'use strict';

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
};

var drawCanvas = function (x, y, w, h) {
    'use strict';

    var i, small_x, small_width;

    small_x = 370;
    small_width = 10;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    for (i = 5; i < 500; i += 30) {
        ctx.fillRect(small_x, i, small_width, small_width);
    }
};

/**
 * Draws the canvas and the paddles.
 */
var drawPaddles = function (x, y, w, h) {
    'use strict';

    paddle1.drawPaddle();
    paddle2.drawPaddle();
};

var clear = function () {
    'use strict';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Draws indicating positions where the paddles can move.
 */
var drawPositions = function (pos) {
    'use strict';

    var i;
    for (i = 0; i < pos.length; i += 1) {
        ctx.font = "18px Share Tech";
        ctx.fillStyle = "white";
        ctx.fillText((i + 1).toString(), 650, pos[i]);
    }
};

/**
 * Draw score for left paddle at (x1, y1) and for
 * right paddle at (x2, y2)
 */
var drawScore = function (x1, y1, x2, y2) {
    'use strict';

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "75px Share Tech";
    ctx.fillText(paddle1.score, x1, y1, 50);
    ctx.fillText(paddle2.score, x2, y2, 50);
};

