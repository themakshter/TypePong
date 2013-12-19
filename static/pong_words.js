var wordList = [];
var currentWords = [];

/**
 * Updates the word of the given position id.
 */
var updateWords = function (id) {
    'use strict';

    var pID;

    if (wordList.length === 0) {
        fetchWords();
    }
    currentWords[id] = wordList.pop();
    pID = '#current_' + id;
    $(pID).html((id + 1) + ": " + currentWords[id]);
};

/**
 * Returns the coloured version of the given string in HTML form
 * by setting the class
 */
var colorify = function (s, colorClass) {
    'use strict';

    s = s.replace(/<span[^>]+>([^<>\s]+)<\/span>/, "$1");
    return '<span class="' + colorClass + '">' + s + '</span>';
};

/**
 * Updates the colour of a specific word or substring.
 */
var updateColor = function (id, colorClass) {
    'use strict';

    var pID = '#current_' + id;
    $(pID).html((id + 1) + ": " + colorify(currentWords[id], colorClass));
};

/**
 * Resets the colours of all words to black.
 */
var resetAllColors = function () {
    'use strict';

    var id;
    for (id = 0; id < currentWords.length; id += 1) {
        updateColor(id, '');
    }
};

/**
 * Fetches the list of words.
 */
var fetchWords = (function () {
    'use strict';
    var currentLevel, scriptRoot;
    currentLevel = 0;
    scriptRoot = 'http://mystical-hawk-370.appspot.com/';

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
