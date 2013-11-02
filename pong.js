var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 0.77;
var dy = 0.99;
var canvas_width = 750;
var canvas_height = 500;
var x_startPos = 750;
var y_startPos = 0;
var paddle1 = new Paddle(50,50);
var paddle2 = new Paddle(700,365);

function Paddle(xPos,yPos){
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = 20;
    this.height = 85;
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
    ctx = canvas.getContext("2d");
    x = x_startPos;
    y = y_startPos;
    return setInterval(draw, 0.5);
}

function hitsPaddle(p,x,y){
   return ((x <= (p.xPos + p.width) && x >= p.xPos) && (y >= p.yPos && y <= (p.yPos + p.height)));
}



function draw() {
    clear();
    ctx.fillStyle = "#000000"; 
    rect(0, 0, canvas_width, canvas_height);
   ctx.fillStyle = "#FFFFFF";
    circle(x, y, 10);

    if (x + dx > canvas_width  || x + dx < 0 || hitsPaddle(paddle1,x+dx,y + dy) || hitsPaddle(paddle2,x+dx,y + dy)) dx = -dx;
    if (y + dy > canvas_height || y + dy < 0 || hitsPaddle(paddle1,x+dx,y + dy) || hitsPaddle(paddle2,x+dx,y + dy) ) dy = -dy;

    x += dx;
    y += dy;
}

init();