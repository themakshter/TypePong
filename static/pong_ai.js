/*
 * AI - 22/11/13
 */
var calculateHitYPos = function (ball_x, ball_y, dx, dy, paddle_x) {
    'use strict';

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


var tryAndMove = function (paddle) {
    'use strict';

    if(((x < paddle.xPos) && (dx > 0)) || (x > paddle.xPos) && (dx < 0)){
        var yPos = calculateHitYPos(x,y,dx,dy,paddle.xPos);
    }

    var sample_size = aiLevel * 10;
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
