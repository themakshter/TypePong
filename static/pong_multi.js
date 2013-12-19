// this is called automatically when a game is created or joined
function setUpGame(data) {
    // set current game to game key
    current_game = data.game_key;

    // open a channel with other player
    channel = new goog.appengine.Channel(data.token);
    socket = channel.open();
}

// message function is a callback function when messages are received
// returnFunc is a callback function when createGame returns response
function createGame(returnFunc, messageFunc) {
    msg = {user: $.cookie("user")}
    $.post('/_create', msg, function(data) {
        setUpGame(data);
        socket.onmessage = messageFunc;
        returnFunc(data);
    });
}

// messageFunc is a callback function when messages are received
// returnFunc is a callback function when joinGame returns response
// if game key is "", joins a random game!
function joinGame(game_key, returnFunc, messageFunc) {
    msg = {user: $.cookie("user"), game_key: game_key}
    $.post('/_join', msg, function(data) {
        setUpGame(data);
        socket.onmessage = messageFunc;
        returnFunc(data);
    });
}

function leaveGame() {
    msg = {user: $.cookie("user"), game_key: current_game}
    $.post('/_leave', msg);
    socket.close();
}

function sendMessage(message) {
    msg = {user: $.cookie("user"), game_key: current_game, message: message}
    $.post('/_message', msg);
};
