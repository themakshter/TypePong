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
var gamePaused = true;

var update = function () {
    ticks++;

    var paddle1_bounce = false, paddle2_bounce = false;

    if (paddle1.hitsHorizontalFace(x + dx, y + dy) && dx < 0) {
        bounce(true);
        paddle1_bounce = true;
    } else if (paddle2.hitsHorizontalFace(x + dx, y + dy) && dx > 0) {
        bounce(true);
        paddle2_bounce = true;
    } else if  (paddle1.hitsVerticalFace(x + dx, y + dy)) {
        bounce(false);
        paddle1_bounce = true;
    } else if (paddle2.hitsVerticalFace(x + dx, y + dy)) {
        bounce(false);
        paddle2_bounce = true;
    } else if (y + dy - circleRadius < 0 && dy < 0) {
        bounce(false);
    } else if (y + dy + circleRadius > canvas.height && dy > 0) {
        bounce(false);
    } else if (x + dx + circleRadius > canvas.width) {
        paddle1.score += 1;
        dx = -dx;
        resetBall();
        console.log(ticks);
    } else if (x + dx - circleRadius < 0) {
        paddle2.score += 1;
        dx = -dx;
        resetBall();
        console.log(ticks);
    }
    x += dx;
    y += dy;

    if ((paddle1_bounce && paddle2.playerType === "remote") ||
        (paddle2_bounce && paddle1.playerType === "remote")) {
        // send message about ball bouncing
        sendMessage(JSON.stringify({
            "type": "ball_update",
            "x": x,
            "y": y,
            "dx": dx,
            "dy": dy,
            "ticks": ticks
        }));
    }
};

var bounce = function(onX) {
    if (onX) {
        dx = -dx;
    } else {
        dy = -dy;
    }
    paddle1.update();
    paddle2.update();
}

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
    ctx.fillStyle = color;
    circle(x, y, circleRadius);

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

    if (!gamePaused) {
        update();
    }

    if (gameActive) {
        requestAnimFrame(gameLoop);
    }
};

