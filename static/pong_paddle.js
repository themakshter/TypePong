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
                this.moveTo(Math.round(newyPos));
            }
        }
    };

    this.tryAndMove = function() {
        'use strict';

        var number, sample_size, dest_y, yPos;

        if(((x < this.xPos) && (dx > 0)) || (x > this.xPos) && (dx < 0)){
            yPos = calculateHitYPos(x,y,dx,dy,this.xPos);
        } else {
            return;
        }

        sample_size = aiLevel * 10;
        if (start_ball || aiLevel === 0) {
            number = 6;
            start_ball = false;
        } else {
            number = Math.round(Math.random() * sample_size);
        }
        if (number <= 5 && this.playerType === "ai") {
            yPos = canvas.height - yPos;
        }

        dest_y = Math.round(yPos - (this.height / 2));
        this.moveTo(dest_y);
    };

    this.moveTo = function(dest_y) {
        var speed = Math.abs(this.dy);
        this.dy = dest_y < this.yPos ? -speed : speed;

        if (dest_y < 0) {
            dest_y = 0 + circle_radius;
        }
        if (dest_y > (canvas.height - this.height)) {
            dest_y = canvas.height - this.height - circle_radius;
        }

        this.reqyPos = dest_y;

        // send that we're moving to other player if in pvp;
        if (this.playerType === "player" && mode === "pvp") {
            console.log("sending " + dest_y);
            if (isNaN(dest_y)) {
                console.log(new Error().stack);
            }
            sendMessage(JSON.stringify({
                "type": "paddle_move",
                "dest_y": dest_y
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
