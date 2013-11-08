var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 2;
var canvas_width = 800;
var canvas_height = 500;
var x_startPos = 200;
var y_startPos = 0;
var paddle1 = new Paddle(100,200);
var paddle2 = new Paddle(canvas_width - 100,200);

function Paddle(xPos,yPos){
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = 20;
    this.height = 85;
    this.hitsHorizontalFace = function(x,y){
        return (((x >= (xPos + this.width) && x <= (xPos + this.width - dx)) ||
            (x <= xPos && x >= xPos - dx)) && ((y >= yPos && y <= (yPos + this.height))));
    };
    this.hitsVerticalFace = function(x,y){
        return (((y >= (yPos + this.height) && y <= (yPos + this.height - dy)) ||
            (y <= yPos && y >= yPos - dy)) && ((x >= xPos && x <= (xPos + this.width))));
    };
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}

function rect(x, y, w, h) {
    small_x = 390;
    small_width = 10;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(paddle1.xPos,paddle1.yPos,paddle1.width,paddle1.height);
    ctx.fillRect(paddle2.xPos,paddle2.yPos,paddle2.width,paddle2.height);
    for(var i = 5; i < 500; i+= 30){
        ctx.fillRect(small_x,i,small_width,small_width);
    }
}


function clear() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.style.width = canvas_width;
    canvas.style.height= canvas_height;
    ctx = canvas.getContext("2d");
    x = x_startPos;
    y = y_startPos;
    return setInterval(draw, 0.5);
}

function draw() {
    clear();
    ctx.fillStyle = "#000000";
    rect(0, 0, canvas_width, canvas_height);
   ctx.fillStyle = "#FFFFFF";
    circle(x, y, 10);

    if (x + dx > canvas_width  || x + dx < 0 || paddle1.hitsHorizontalFace(x+dx,y + dy) || paddle2.hitsHorizontalFace(x+dx,y + dy)) dx = -dx;
    else if (y + dy > canvas_height || y + dy < 0 || paddle1.hitsVerticalFace(x+dx,y + dy) || paddle2.hitsVerticalFace(x+dx,y + dy)) dy = -dy;

    x += dx;
    y += dy;
}

init();
