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
