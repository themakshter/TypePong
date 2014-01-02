var totalSeconds = 0;
var seconds = "00", minutes = "00";

var level = 0
var intervalId = 0;

var initClockDraw = function () {
    'use strict';

    if (!intervalId)
        intervalId = setInterval(setTime, 1000);
};

var clockDraw = function (seconds, minutes) {
    'use strict';

    var text = padNumber(minutes, 0, 2) + ":" +
               padNumber(seconds, 0, 2);

    ctx.font = "52px Share Tech";
    ctx.fillStyle = "#4EAD3E";
    ctx.fillText(text, 220, 50);
};

var setTime = function () {
    'use strict';

    totalSeconds += 1;

    if (totalSeconds % 30 == 0) {
        level += 1;
        fetchWordsAsync(level);
    }
    if (totalSeconds % 60 == 0) {
        paddle1.changeSpeed(paddle1.dy * 1.25);
        paddle2.changeSpeed(paddle1.dy * 1.25);
        changeBallSpeed(dx * 1.25, dy * 1.25);
    }

    seconds = totalSeconds % 60;
    minutes = Math.floor(totalSeconds / 60);
};
