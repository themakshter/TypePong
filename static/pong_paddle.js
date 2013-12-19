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
        endX = startX - dx + circleRadius;
        startY = this.yPos - circleRadius;
        endY = this.yPos + this.height + circleRadius;

        return (((x >= startX && x <= endX) ||
                    (x <= this.xPos && x >= this.xPos - dx - circleRadius)) &&
                    (y >= startY && y <= endY));
    };

    this.hitsVerticalFace = function (x, y) {
        var startX, endX, startY, endY;
        startY = this.yPos + this.height;
        endY = startY - dy + circleRadius;
        startX = this.xPos - circleRadius;
        endX = this.xPos + this.width + circleRadius;

        return (((y >= startY && y <= endY) ||
                    (y <= this.yPos && y >= this.yPos - dy - circleRadius)) &&
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
                this.moveTo(Math.round(newyPos));
            }
        }
    };

    this.tryAndMove = function() {
        'use strict';

        var number, sampleSize, destY, yPos;

        if(((x < this.xPos) && (dx > 0)) || (x > this.xPos) && (dx < 0)){
            yPos = calculateHitYPos(x,y,dx,dy,this.xPos);
        } else {
            return;
        }

        sampleSize = aiLevel * 10;
        if (startBall || aiLevel === 0) {
            number = 6;
            startBall = false;
        } else {
            number = Math.round(Math.random() * sampleSize);
        }
        if (number <= 5 && this.playerType === "ai") {
            yPos = canvas.height - yPos;
        }

        destY = Math.round(yPos - (this.height / 2));
        this.moveTo(destY);
    };

    this.moveTo = function(destY) {
        var speed = Math.abs(this.dy);
        this.dy = destY < this.yPos ? -speed : speed;

        if (destY < 0) {
            destY = 0;
        }
        if (destY > (canvas.height - this.height)) {
            destY = canvas.height - this.height;
        }

        this.reqyPos = destY;

        // send that we're moving to other player if in pvp;
        if (this.playerType === "player" && mode === "pvp") {
            console.log("sending " + destY);
            if (isNaN(destY)) {
                console.log(new Error().stack);
            }
            sendMessage(JSON.stringify({
                "type": "paddle_move",
                "destY": destY
            }));
        }
    }

    this.drawPaddle = function () {
        if ((this.dy * (this.yPos - this.reqyPos) < 0)) {
            this.yPos += this.dy;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
};
