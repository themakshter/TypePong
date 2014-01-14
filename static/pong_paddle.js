/**
 * Paddle object
 */
var Paddle = function (xPos, yPos,playerType) {
    'use strict';
    this.origY = yPos;
    this.xPos = xPos;
    this.yPos = yPos;
    this.reqyPos = yPos;
    this.dy = 2;
    this.width = 20;
    this.height = 85;
    this.score = 0;
    this.playerType = playerType;
    this.messageQueue = []

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

    this.update = function () {
        if (this.playerType === "ai") {
            this.tryAndMove();
        }
    };

    this.resetPosition = function(){
        this.yPos = this.origY;
        this.reqyPos = this.origY;
    }

    this.updatePosition = function () {
        if ((this.dy * (this.yPos - this.reqyPos) < 0)) {
            this.yPos += this.dy;
        }
    }

    this.wordTyped = function (pos, i) {
        if (this.playerType === "player") {
            var ballYPos = calculateHitYPos(x,y,dx,dy,this.xPos);
            var speed = Math.abs(this.dy);
            var startSeg = canvas.height * (i/pos.length);
            var endSeg   = canvas.height * ((i+1)/pos.length);

            var newyPos = pos[i] - this.height / 2;
            if (ballYPos > startSeg && ballYPos < endSeg && this.inPortion()) {
                this.tryAndMove();
            } else {
                this.moveTo(Math.round(newyPos));
            }
        }
    };

    this.inPortion = function (){
       return ((x < this.xPos) && (dx > 0)) || ((x > this.xPos) && (dx < 0));
    }

    this.tryAndMove = function () {
        'use strict';

        var minAccuracy, sampleSize,step, destY, yPos;
        sampleSize = 100;
        minAccuracy = 25;
        step = 75/9;
        if(this.inPortion()){
            yPos = calculateHitYPos(x,y,dx,dy,this.xPos);
        } else {
            return;
        }

        var toAdd = (aiLevel - 1) * step;
        var number = Math.round(minAccuracy + toAdd);

        if (startBall || aiLevel === 0) {
            number = 100;
            startBall = false;
        } 
        
        var toCheck = Math.round(Math.random() * sampleSize);
        if (toCheck >= number && this.playerType === "ai") {
            // go in opposite direction
            yPos = canvas.height - yPos;
        }

        destY = Math.round(yPos - (this.height / 2));
        this.moveTo(destY);
    };

    this.moveTo = function (destY) {
        var speed = Math.abs(this.dy);
        this.dy = destY < this.yPos ? -speed : speed;

        if (destY < 0) {
            destY = 0 + circleRadius;
        }
        if (destY > (canvas.height - this.height)) {
            destY = canvas.height - this.height - circleRadius;
        }

        this.reqyPos = destY;

        // send that we're moving to other player if in pvp;
        if (this.playerType !== "remote" && mode === "pvp") {
            sendMessage(JSON.stringify({
                "type": "paddle_move",
                "destY": destY
            }));
        }
    }

    this.changeSpeed = function (newSpeed){
        if(this.playerType !== "ai"){
            this.dy = newSpeed;
        }
    }

    this.drawPaddle = function () {
        ctx.fillStyle = colour;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
};
