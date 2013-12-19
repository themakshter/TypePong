var totalSeconds = 0;
var seconds = "00", minutes = "00";

var initClockDraw = function () {
    'use strict';

    clockDraw("00", "00");
    setInterval(setTime, 1000);
};

var clockDraw = function (seconds, minutes) {
    'use strict';

    var text = minutes + ":" + seconds;

    ctx.font = "32px Share Tech";
    ctx.fillStyle = "blue";
    ctx.fillText(text, 120, 50);
};

var setTime = function () {
    'use strict';

    totalSeconds += 1;
    seconds = padNumber(totalSeconds % 60, 0, 2);
    minutes = padNumber(Math.floor(totalSeconds / 60), 0, 2);
};
