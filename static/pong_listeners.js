/**
 * Typing Listener; handles word colouring and paddle movement.
 */
window.onkeyup = (function () {
    'use strict';

    var typeElem, pos;

    typeElem = $('#typing');
    pos = markPositions(3);

    return function (e) {
        var i, typed, typedLC, currentWordLC;

        if (e.keyCode == 27) {
            if (gamePaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        } else {
            typed = typeElem.val();
            typedLC = typed.toLowerCase();

            for (i = 0; i < currentWords.length; i += 1) {
                currentWordLC = currentWords[i].toLowerCase();
                if (typedLC === currentWordLC.substring(0, typed.length) && typed) {
                    updateColor(i, 'correct-word');
                } else if (typed.length > 1 && typedLC.substring(0, typed.length - 1) === currentWordLC.substring(0, typed.length - 1)) {
                    updateColor(i, 'wrong-word');
                } else if (!typed) {
                    resetAllColors();
                }

                if (typedLC === currentWordLC) {
                    typeElem.val("");
                    paddle1.wordTyped(pos, i);
                    paddle2.wordTyped(pos, i);
                    updateWords(i);
                    resetAllColors();
                }
            }
        }
    };
}());

$(window).focus(function () {
    'use strict';

    if (mode === 'challenge' && !intervalId)
        intervalId = setInterval(setTime, 1000);
});

$(window).blur(function () {
    'use strict';

    pauseGame();
    clearInterval(intervalId);
    intervalId = 0;
});
