/**
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

        return (((x >= startX && x <= endX) ||
                    (x <= this.xPos && x >= this.xPos - dx - circle_radius)) &&
                    (y >= startY && y <= endY));
    };

    this.hitsVerticalFace = function (x, y) {
        var startX, endX, startY, endY;
        startY = this.yPos + this.height;
        endY = startY - dy + circle_radius;
        startX = this.xPos - circle_radius;
        endX = this.xPos + this.width + circle_radius;

        return (((y >= startY && y <= endY) ||
                    (y <= this.yPos && y >= this.yPos - dy - circle_radius)) &&
                    (x >= startX && x <= endX));
    };

    this.update = function() {
        if (this.playerType === "ai") {
            this.tryAndMove();
        }
    };

    this.wordTyped = function(pos, i) {
        if (this.playerType === "player") {
            var ballYPos = calculateHitYPos(x,y,dx,dy,this.xPos);
            var speed = Math.abs(this.dy);
            var startSeg = canvas.height * (i/pos.length);
            var endSeg   = canvas.height * ((i+1)/pos.length);

            var newyPos = pos[i] - this.height / 2;
            if (ballYPos > startSeg && ballYPos < endSeg) {
                this.tryAndMove();
            } else {
                this.dy = newyPos < this.yPos ? -speed : speed;
                this.reqyPos = Math.round(newyPos);
            }
        }
    };

    this.tryAndMove = function() {
        'use strict';

        var number, sample_size, speed;

        if(((x < this.xPos) && (dx > 0)) || (x > this.xPos) && (dx < 0)){
            var yPos = calculateHitYPos(x,y,dx,dy,this.xPos);
        }

        sample_size = aiLevel * 10;
        speed = Math.abs(this.dy);
        if (start_ball || aiLevel === 0) {
            number = 6;
            start_ball = false;
        } else {
            number = Math.round(Math.random() * sample_size);
        }
        if (number <= 5) {
            // speed = -speed;
            yPos = canvas.height - yPos;
        }
        this.dy = yPos < this.yPos ? -speed : speed;
        this.reqyPos = Math.round(yPos - (this.height / 2));
    };

    this.drawPaddle = function () {
        if (this.reqyPos < 0) {
            this.reqyPos = 0;
        }
        if (this.reqyPos > (canvas.height - this.height)) {
            this.reqyPos = canvas.height - this.height;
        }
        if ((this.dy * (this.yPos - this.reqyPos) < 0)) {
            this.yPos += this.dy;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
};
