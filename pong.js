var canvas;
var ctx;
var x = 750;
var y = 500;
var dx = 2;
var dy = 4;
var WIDTH = 750;
var HEIGHT = 500;
var player1_x = 50;
var player1_y = 50;
var player2_x = 700;
var player2_y = 365;
var player_width = 20;
var player_height = 85;



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
    ctx.fillRect(player1_x,player1_y,player_width,player_height);
    ctx.fillRect(player2_x,player2_y,player_width,player_height);
    for(var i = 5; i < 500; i+= 30){
        ctx.fillRect(small_x,i,small_width,small_width);
    }
    
}


function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    return setInterval(draw, 10);
}

function withinPlayer1(x,y){
    var inside = false;
    if((x < (player1_x + player_width) && x < player1_x) && (y < (player1_y + player_height) && y > player1_y)){
        inside = true;
    }
     return inside;  
}

function draw() {
    clear();
    ctx.fillStyle = "#000000"; 
    rect(0, 0, WIDTH, HEIGHT);
   ctx.fillStyle = "#FFFFFF";
    circle(x, y, 10);

    if (x + dx > WIDTH || x + dx < 0 || withinPlayer1(x + dx,y + dy)) dx = -dx;
    if (y + dy > HEIGHT || y + dy < 0) dy = -dy;

    x += dx;
    y += dy;
}

init();