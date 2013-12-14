window.requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame  ||
    window.oRequestAnimationFrame   ||
    window.msRequestAnimationFrame   ||
    function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
    };
})();

var gameActive = true;

var update = function () {
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
};

var gameLoop = function() {
    'use strict';

    draw();
    update();

    if (gameActive) {
        requestAnimFrame(gameLoop);
    }
};
