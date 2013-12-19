/**
 * this is called automatically when a game is created or joined
 */
var setUpGame = function (data) {
    // set current game to game key
    current_game = data.game_key;

    // open a channel with other player
    channel = new goog.appengine.Channel(data.token);
    socket = channel.open();
}

/**
 * message function is a callback function when messages are received
 * returnFunc is a callback function when createGame returns response
 */
var createGame = function (returnFunc, messageFunc) {
    msg = {user: $.cookie("user")}
    $.post('/_create', msg, function(data) {
        setUpGame(data);
        socket.onmessage = messageFunc;
        returnFunc(data);
    });
}

/**
 * messageFunc is a callback function when messages are received
 * returnFunc is a callback function when joinGame returns response
 * if game key is "", joins a random game!
 */
var joinGame = function (game_key, returnFunc, messageFunc) {
    msg = {user: $.cookie("user"), game_key: game_key}
    $.post('/_join', msg, function(data) {
        if (data.game_found) {
            setUpGame(data);
            socket.onmessage = messageFunc;
        }
        returnFunc(data);
    });
}

var leaveGame = function () {
    msg = {user: $.cookie("user"), game_key: current_game}
    $.post('/_leave', msg);
    socket.close();
}

var sendMessage = function (message) {
    msg = {user: $.cookie("user"), game_key: current_game, message: message}
    $.post('/_message', msg);
};
