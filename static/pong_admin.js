var fetchWords = (function () {
    'use strict';
    var currentLevel, scriptRoot;
    currentLevel = 0;
    scriptRoot = '/';

    return function () {
        $.ajax({
            url: scriptRoot + '_loadwords',
            async: false,
            data: {
                level: currentLevel
            },
            dataType: 'json',
            success: function (data) {
                currentLevel += 1;
                $.each(data, function (key, val) {
                    wordList.push(val);
                });
            }
        });
    };
}());

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
                newyPos = pos[i] - paddle2.height / 2;
                paddle2.dy = newyPos < paddle2.yPos ? -2 : 2;
                paddle2.reqyPos = Math.round(newyPos);
                typeElem.val('');
                updateWords(i);
                resetAllColors();
            }
        }
    };
}());
