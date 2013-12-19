/**
 * AI 
 */
var calculateHitYPos = function (ballX, ballY, dx, dy, paddleX) {
    'use strict';

    var yPos = y + Math.abs(((x - (paddleX + 20)) / dx)) * dy;
    while (yPos< 0 || yPos > canvas.height) {
        if (yPos > canvas.height) {
            yPos = canvas.height - (yPos - canvas.height);
        } else if (yPos < 0) {
            yPos *= -1;
        }
    }
    return yPos;
};
