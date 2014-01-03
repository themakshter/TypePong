var wordList = [];
var currentWords = [];

/**
 * Updates the word of the given position id.
 */
var updateWords = function (id) {
    'use strict';

    var i, pID, newWord;
    if (wordList.length <= 5) {
        fetchWordsAsync(campaignLevel);
    }

    newWord = wordList.pop();
    for (i = 0; i < currentWords.length; i += 1) {
        if (newWord.charAt(0) === currentWords[i].charAt(0)) {
            updateWords(id);
            return;
        }
    }
    currentWords[id] = newWord;

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
var fetchWordsSync = function (currLevel) {
    'use strict';

    $.ajax({
        url: '/_loadwords',
        async: false,
        data: {
            'level': currLevel
        },
        dataType: 'json',
        success: function (data) {
            $.each(data, function (key, val) {
                wordList.push(val);
            });
        }
    });
};

var fetchWordsAsync = function (currLevel) {
    'use strict';

    $.getJSON('/_loadwords', {
        'level': currLevel
    }, function (data) {
        wordList.length = 0;
        $.each(data, function (i, item) {
            wordList.push(item);
        });
    });
};
