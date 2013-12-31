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
    msgWidth = ctx2.measureText(message).width;

    ctx2.fillText(message, (canvas.width / 2) - (msgWidth / 2),
            canvas.height / 2);
};

/**
 * Hide displayed message and resume game.
 */
var hideMessage = function() {
    'use strict';

    var layer2, ctx2;

    $(canvas).removeClass("pongblur");
    layer2 = document.getElementById("layer2");
    ctx2 = layer2.getContext("2d");

    ctx2.clearRect(0, 0, layer2.width, layer2.height);
};
