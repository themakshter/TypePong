/**
 * AI - 22/11/13
 */
var calculateHitYPos = function (ball_x, ball_y, dx, dy, paddle_x) {
    'use strict';

    var yPos = y + Math.abs(((x - (paddle_x + 20)) / dx)) * dy;
    while (yPos< 0 || yPos > canvas.height) {
        if (yPos > canvas.height) {
            yPos = canvas.height - (yPos - canvas.height);
        } else if (yPos < 0) {
            yPos *= -1;
        }
    }
    return yPos;
};


var tryAndMove = function (paddle) {
    'use strict';

    var number, sample_size, speed;

    if(((x < paddle.xPos) && (dx > 0)) || (x > paddle.xPos) && (dx < 0)){
        var yPos = calculateHitYPos(x,y,dx,dy,paddle.xPos);
    }

    sample_size = aiLevel * 10;
    speed = Math.abs(paddle.dy);
    if (start_ball || aiLevel === 0) {
        number = 6;
        start_ball = false;
    } else {
        number = Math.round(Math.random() * sample_size);
    }
    if (number <= 5 && paddle.playerType === "ai") {
        // speed = -speed;
        yPos = canvas.height - yPos;
    }
    paddle.dy = yPos < paddle.yPos ? -speed : speed;
    paddle.reqyPos = Math.round(yPos - (paddle.height / 2));
};
