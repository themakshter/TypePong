/**
 * Typing Listener; handles word colouring and paddle movement.
 */
window.onkeyup = (function () {
    'use strict';

    var i, typeElem, pos, newyPos;

    typeElem = $('#typing');
    pos = markPositions(3);

    return function () {
        var typed, typedLC, currentWordLC;
        typed = typeElem.val();
        typedLC = typed.toLowerCase();

        for (i = 0; i < currentWords.length; i += 1) {
            currentWordLC = currentWords[i].toLowerCase();
            if (typedLC === currentWordLC.substring(0, typed.length) && typed) {
                updateColor(i, 'green');
            } else if (typed.length > 1 && typedLC.substring(0, typed.length - 1) === currentWordLC.substring(0, typed.length - 1)) {
                updateColor(i, 'red');
            } else if (!typed) {
                resetAllColors();
            }

            if (typedLC === currentWordLC) {
                var ballYPos = calculateHitYPos(x,y,dx,dy,paddle2.xPos);
                var speed = Math.abs(paddle2.dy);
                var startSeg = canvas.height * (i/pos.length);
                var endSeg   = canvas.height * ((i+1)/pos.length);

                newyPos = pos[i] - paddle2.height / 2;
                if (ballYPos > startSeg && ballYPos < endSeg) {
                    tryAndMove(paddle2);
                } else {
                    paddle2.dy = newyPos < paddle2.yPos ? -speed : speed;
                    paddle2.reqyPos = Math.round(newyPos);
                }
                typeElem.val('');
                updateWords(i);
                resetAllColors();
            }
        }
    };
}());
