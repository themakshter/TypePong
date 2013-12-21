"""Game and messaging module that handles messages that should be sent between users in-game."""

from google.appengine.api import channel
from google.appengine.ext import db

from webapp2 import RequestHandler

import cgi
import json

class Game(db.Model):
    """Stores current games available to join."""
    available = db.BooleanProperty(required=True, default=True)
    user_1 = db.StringProperty(required=True)
    user_2 = db.StringProperty(required=False)

    @db.transactional
    def join(self, user_2):
        """Joins new user to this game."""

        # throw exception if game is full
        if not self.available: raise GameFull()

        # set player 2
        self.user_2 = user_2

        # send join message to first player
        message = {
            'type': 'join',
            'user': user_2
        }

        send(self.user_1, json.dumps(message))

        # set game as unavailable to join
        self.available = False

        # update database
        self.put()

    def json_data(self, user):
        token = channel.create_channel(user)

        message = {
            'game_found': True,
            'game_key': str(self.key()),
            'token': token
        }

        return json.dumps(message)

    def other_user(self, user):
        """Return user id of the other user in the game."""
        print user, self.user_1, self.user_2
        if user == self.user_1:
            return self.user_2
        else:
            return self.user_1

class GameFull(Exception):
    pass

def send(user, message):
    channel.send_message(user, message)

class CreateGame(RequestHandler):
    """Create a game and return the game's key and channel token (for listening)."""

    def post(self):
        user = cgi.escape(self.request.get('user'))

        game = Game(key_name=user, user_1=user)
        game.put()

        # send information about game back to client
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(game.json_data(user))

class JoinGame(RequestHandler):
    """Join a game by providing the game key."""

    def post(self):
        user = cgi.escape(self.request.get('user'))
        game_key = cgi.escape(self.request.get('game_key'))

        # if no key provided, join a randomly selected available game
        if game_key == "":
            game = db.GqlQuery("SELECT * FROM Game WHERE available = True").get()
        else:
            # else join the specified game
            game = db.get(game_key)

        # send information about game back to client
        self.response.out.headers['Content-Type'] = 'application/json'

        if game:
            # a game was found, return game data
            game.join(user)
            self.response.out.write(game.json_data(user))
        else:
            # no game was found, return appropriate message
            self.response.out.write(json.dumps({ 'game_found': False }))

class LeaveGame(RequestHandler):
    """Leave a game by providing the game key."""

    def post(self):
        user = cgi.escape(self.request.get('user'))
        game_key = cgi.escape(self.request.get('game_key'))

        game = db.get(game_key)

        game.delete()

        # send leave message to other user
        message = {
            'type': 'leave',
            'user': user
        }

        send(game.other_user(user), json.dumps(message))

class Message(RequestHandler):
    """Send a message to the other player in a game."""

    def post(self):
        user = cgi.escape(self.request.get('user'))
        game_key = cgi.escape(self.request.get('game_key'))
        message = cgi.escape(self.request.get("message"))

        game = Game.get(game_key)

        # send message to the other user in the game
        send(game.other_user(user), message)
