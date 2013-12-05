function setUpGame(data) {
    // set current game to game key
    current_game = data.game_key;

    // open a channel with other player
    channel = new goog.appengine.Channel(data.token);
    socket = channel.open();
}

// message function is a callback function when messages are received
function createGame(messageFunc) {
    msg = {user: $.cookie("user")}
    $.post('/_create', msg, function(data) {
        setUpGame(data);
        socket.onmessage = messageFunc;
        alert(data)
    });
}

// message function is a callback function when messages are received
// if game key is "", joins a random game!
function joinGame(game_key, messageFunc) {
    msg = {user: $.cookie("user"), game_key: game_key}
    $.post('/_join', msg, function(data) {
        setUpGame(data);
        socket.onmessage = messageFunc;
        alert(data)
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
