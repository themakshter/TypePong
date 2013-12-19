window.requestAnimFrame = (function (){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var gameActive = true;

var update = function () {
    if (paddle1.hitsHorizontalFace(x + dx, y + dy) ||
            paddle2.hitsHorizontalFace(x + dx, y + dy)) {
        dx = -dx;
        paddle1.update();
        paddle2.update();
    } else if (y + dy + circle_radius > canvas.height ||
               y + dy - circle_radius < 0 ||
               paddle1.hitsVerticalFace(x + dx, y + dy) ||
               paddle2.hitsVerticalFace(x + dx, y + dy)) {
        dy = -dy;
        paddle1.update();
        paddle2.update();
    } else if (x + dx + circle_radius > canvas.width) {
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

/**
 * Draws all graphical elements.
 */
var draw = function () {
    'use strict';

    var pos;

    clear();
    ctx.fillStyle = "#000000";
    drawCanvas(0, 0, canvas.width, canvas.height);
    drawPaddles();
    ctx.fillStyle = "#FFFFFF";
    circle(x, y, circle_radius);

    pos = markPositions(3);
    drawPositions(pos);

    switch (mode) {
        case 'campaign':
            drawScore(305, 75, 400, 75);
            break;
        case 'challenge':
            clockDraw(seconds, minutes);
            break;
    }

    if (paddle1.score >= endingScore) {
        loseGame();
        return;
    } else if (paddle2.score >= endingScore) {
        winGame();
        return;
    }
};

var gameLoop = function () {
    'use strict';

    draw();
    update();
    if (gameActive) {
        requestAnimFrame(gameLoop);
    }
};

