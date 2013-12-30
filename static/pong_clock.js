var totalSeconds = 0;
var seconds = "00", minutes = "00";

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
    seconds = totalSeconds % 60;
    minutes = Math.floor(totalSeconds / 60);
};

$(window).focus(function () {
    'use strict';

    if (!intervalId)
        intervalId = setInterval(setTime, 1000);
});

$(window).blur(function () {
    'use strict';

    clearInterval(intervalId);
    intervalId = 0;
});
