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
        ctx.font = "75px Share Tech";
        ctx.fillText(this.score, score_x, score_y, 50);
    };
};
