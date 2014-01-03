var padNumber = function (number, pad, len) {
    'use strict';

    var retval, n, padded;

    retval = number.toString();
    n = len - retval.length;
    padded = new Array(n + 1).join(pad);

    return padded + retval;
};

/**
 * Pauses the game and displays a message.
 */
var displayMessage = function (message) {
    'use strict';

    var msgWidth, layer2, ctx2;

    $(canvas).addClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = "#FFFFFF";

    wrapText(ctx2, message, canvas.width / 2, canvas.height / 2 - 50,
            3 * canvas.width / 4, 50);
};

/**
 * Hide displayed message and resume game.
 */
var hideMessage = function () {
    'use strict';

    var layer2, ctx2;

    $(canvas).removeClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.clearRect(0, 0, layer2.width, layer2.height);
};

var fadeMessage = function (message) {
    'use strict';

    var layer2, ctx2, alpha, fadeID;

    pauseGame(false);

    $(canvas).addClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = "#FFFFFF";

    alpha = 1;
    fadeID = setInterval(function () {
        alpha -= .05;
        if (alpha < 0) {
            clearInterval(fadeID);
            hideMessage();
            resumeGame();
            ctx2.globalAlpha = 1;
            return;
        }
        ctx2.globalAlpha = alpha;

        ctx2.clearRect(0, 0, layer2.width, layer2.height);
        wrapText(ctx2, message, canvas.width / 2, canvas.height / 2 - 50,
            3 * canvas.width / 4, 50);
    }, 50);
};

var wrapText = function (context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var n, width, testLine, metrics, testWidth;

    for(n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        metrics = context.measureText(testLine);
        testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            metrics = context.measureText(line);
            width = metrics.width;
            context.fillText(line, x - width / 2, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }

    metrics = context.measureText(line);
    width = metrics.width;
    context.fillText(line, x - width / 2, y);
};

var fadeMessages = function (messages) {
    'use strict';
    var layer2, ctx2, alpha, fadeID;

    pauseGame(false);

    $(canvas).addClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.font = "50px Share Tech";
    ctx2.fillStyle = "#FFFFFF";

    alpha = 1;
    fadeID = setInterval(function () {
        alpha -= .05;
        if (alpha < 0) {
            messages.shift();
            alpha = 1;
        }
        if (messages.length === 0) {
                hideMessage();
                resumeGame();
                clearInterval(fadeID);
                ctx2.globalAlpha = 1;
                return;
        }
        ctx2.globalAlpha = alpha;
        ctx2.clearRect(0, 0, layer2.width, layer2.height);
        wrapText(ctx2, messages[0], canvas.width / 2, canvas.height / 2 - 50,
            3 * canvas.width / 4, 50);
    }, 50);
};
