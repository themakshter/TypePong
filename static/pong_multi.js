var gameKey = '';
var pvpOpponent = 0;

/**
 * this is called automatically when a game is created or joined
 */
var setUpGame = function (data) {
    // set current game to game key
    current_game = data.game_key;

    // open a channel with other player
    channel = new goog.appengine.Channel(data.token);
    socket = channel.open();
};

/**
 * message function is a callback function when messages are received
 * returnFunc is a callback function when createGame returns response
 */
var createGame = function (returnFunc, messageFunc) {
    msg = {user: $.cookie("user")}// TODO fix hardcoded elo
    $.post('/_create', msg, function(data) {
        setUpGame(data);
        socket.onmessage = messageFunc;
        returnFunc(data);
    });
};

/**
 * messageFunc is a callback function when messages are received
 * returnFunc is a callback function when joinGame returns response
 * if game key is "", joins a random game!
 */
var joinGame = function (game_key, returnFunc, messageFunc) {
    // alert($.cookie("ELO"));
    msg = {user: $.cookie("user"), game_key: game_key}
    $.post('/_join', msg, function(data) {
        if (data.game_found) {
            setUpGame(data);
            socket.onmessage = messageFunc;
        }
        returnFunc(data);
    });
};

var leaveGame = function () {
    msg = {user: $.cookie("user"), game_key: current_game}
    $.post('/_leave', msg);
    socket.close();
};

var sendMessage = function (message) {
    msg = {user: $.cookie("user"), game_key: current_game, message: message}
    console.log("send " + message);
    $.post('/_message', msg);
};

var returnFunc = function(data) {
    if (!data.game_found) {
        // if no game found, create a game instead
        createGame(function() {}, receiveMessage);
        hosting = true;
        setPaddles("remote", "player");
        hideMessage();
        displayMessage("Waiting... No players online");
        gamePaused = true;
    } else if (data.opponent === $.cookie('user')) {
        hosting = true;
        setPaddles("remote", "player");
        hideMessage();
        displayMessage("Waiting... No players online");
        gamePaused = true;
    } else {
        if (data.opponent) {
            pvpOpponent = data.opponent;
            hideMessage();
            hosting = false;
            setPaddles("player", "remote");
            ticks = 0;
            countdown[0] = "Pvp mode";
            resetBall();
        } else {
            hosting = true;
            setPaddles("remote", "player");
            hideMessage();
            displayMessage("Waiting... No players online");
            gamePaused = true;
        }
    }
};

/**
 * Receive a message from another player
 */
var receiveMessage = function (message) {
    console.log("receive " + message.data);

    var data = JSON.parse(message.data);

    switch(data.type) {
        case 'join':
            // hide waiting message and resume game
            hideMessage();
            ticks = 0;
            countdown[0] = "Pvp mode";
            resetBall();
            break;
        case 'paddle_move':
            if (paddle1.playerType === "remote") {
                paddle1.moveTo(data.destY);
            } else {
                paddle2.moveTo(data.destY);
            }
            break;
        case 'ball_update':
            dx = data.dx;
            dy = data.dy;
            x = data.x + dx * (ticks - data.ticks);
            y = data.y + dy * (ticks - data.ticks);
            break
        case 'ball_reset':
                tempDx = data.dx;
                tempDy = data.dy;
                break;
        case 'score_change':
                paddle1.score = data.score1;
                paddle2.score = data.score2;
                break
        case 'display_message'://Used to display score changes etc
                    displayMessage(data.message);
    }
};
