var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var canvas_width = 750;
var canvas_height = 500;
var x_startPos = 350;
var y_startPos = 350;
var paddle1 = new Paddle(50, 200);
var paddle2 = new Paddle(700, 200);
var circle_radius = 10;

function Paddle(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.reqyPos = yPos;
    this.dy = 3;
    this.width = 20;
    this.height = 100;
    this.score = 0;
    this.hitsHorizontalFace = function (x, y) {
        return (((x >= (this.xPos + this.width) && x <= (this.xPos + this.width - dx + circle_radius)) || (x <= this.xPos && x >= this.xPos - dx - circle_radius)) && ((y >= this.yPos - circle_radius && y <= (this.yPos + this.height + circle_radius))));
    };
    this.hitsVerticalFace = function (x, y) {
        return (((y >= (this.yPos + this.height) && y <= (this.yPos + this.height - dy + circle_radius)) || (y <= this.yPos && y >= this.yPos - dy - circle_radius)) && ((x >= this.xPos - circle_radius && x <= (this.xPos + this.width + circle_radius))));
    };
    this.drawPaddle = function () {
        ctx.fillStyle = "#FFFFFF";
        if (this.dy * (this.yPos - this.reqyPos) < 0) 
            this.yPos += this.dy;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
    this.writeScore = function (score_x, score_y) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "75px Terminator Two";
        ctx.fillText(this.score, score_x, score_y, 50);
    };
}



function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}

function rect(x, y, w, h) {
    small_x = 370;
    small_width = 10;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    paddle1.drawPaddle();
    paddle1.writeScore(305, 75);
    paddle2.drawPaddle();
    paddle2.writeScore(400, 75);
    for (var i = 5; i < 500; i += 30) {
        ctx.fillRect(small_x, i, small_width, small_width);
    }
}


function clear() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    x = x_startPos;
    y = y_startPos;
    return setInterval(draw, 10);
}

function draw() {
    clear();
    ctx.fillStyle = "#000000";
    rect(0, 0, canvas_width, canvas_height);
    ctx.fillStyle = "#FFFFFF";
    circle(x, y, circle_radius);

    var pos = markPositions(3);
    drawPositions(canvas, ctx, pos);

    if (paddle1.hitsHorizontalFace(x + dx, y + dy) || paddle2.hitsHorizontalFace(x + dx, y + dy)) dx = -dx;
    else if (y + dy + circle_radius > canvas_height || y + dy - circle_radius < 0 || paddle1.hitsVerticalFace(x + dx, y + dy) || paddle2.hitsVerticalFace(x + dx, y + dy)) dy = -dy;
    else if (x + dx + circle_radius > canvas_width) {
        paddle1.score++;
        dx = -dx;
        resetBall();
    } else if (x + dx - circle_radius < 0) {
        paddle2.score++;
        dx = -dx;
        resetBall();
    }

    x += dx;
    y += dy;
}

var resetBall = function () {
    x = canvas_width / 2;
    y = canvas_height / 2;
}

var markPositions = function (n) {
    var pos = [];
    for (var i = 0; i < n; i++) {
        pos.push((canvas_height * (i + 1) / n) - (canvas_height) / (2 * n));
    }
    return pos;
}

var drawPositions = function (canvas, ctx, pos) {
    for (var i = 0; i < pos.length; ++i) {
        ctx.font = "18px Terminator Two";
        ctx.fillStyle = "white";
        ctx.fillText((i + 1).toString(), 650, pos[i]);
    }
};

init();

//Type racer
window.onkeyup = (function () {
    'use strict';
    var i, typeElem, pos, newyPos;

    typeElem = $('#typing');
    pos = markPositions(3);

    return function () {
        var typed;
        typed = typeElem.val();
        var direction = Math.abs(paddle2.dy);
        if (typed.toLowerCase() === 'first') {
            newyPos = pos[0] - paddle2.height / 2;
            paddle2.dy = newyPos < paddle2.yPos ? -direction : direction;
            paddle2.reqyPos = Math.round(newyPos);
            typeElem.val('');
        } else if (typed.toLowerCase() === 'second') {
            newyPos = pos[1] - paddle2.height / 2;
            paddle2.dy = newyPos < paddle2.yPos ? -direction : direction;
            paddle2.reqyPos = Math.round(newyPos);
            typeElem.val('');
        } else if (typed.toLowerCase() === 'third') {
            newyPos = pos[2] - paddle2.height / 2;
            paddle2.dy = newyPos < paddle2.yPos ? -direction : direction;
            paddle2.reqyPos = Math.round(newyPos);
            typeElem.val('');
        }
    };
}());