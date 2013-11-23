"""Game and messaging module that handles messages that should be sent between users in-game."""

from google.appengine.api import channel
from google.appengine.ext import db

from webapp2 import RequestHandler

import cgi
import json

class Game(db.Model):
    """Stores current games available to join."""
    available = db.BooleanProperty(required=True, default=True)
    user_id_1 = db.IntegerProperty(required=True)
    user_id_2 = db.IntegerProperty(required=False)

    @db.transactional
    def join(self, user_id_2):
        """Joins new user to this game."""

        # throw exception if game is full
        if not self.available: raise GameFull()

        # set player 2
        self.user_id_2 = user_id_2

        # send join message to first player
        message = {
            'message': 'join',
            'user_id': user_id_2
        }

        send(self.user_id_1, json.dumps(message))

        # set game as unavailable to join
        self.available = False

        # update database
        self.put()

    def json_data(self, user_id):
        token = channel.create_channel(str(user_id))

        message = {
            'game_key': str(self.key()),
            'token': token
        }

        return json.dumps(message)

    def other_user(self, user_id):
        """Return user id of the other user in the game."""
        if user_id == self.user_id_1:
            return self.user_id_2
        else:
            return self.user_id_1

class GameFull(Exception):
    pass

def send(user_id, message):
    channel.send_message(str(user_id), message)

class CreateGame(RequestHandler):
    """Create a game and return the game's key and channel token (for listening)."""

    def get(self):
        user_id = cgi.escape(self.request.get('user_id'))

        game = Game(key_name=user_id, user_id_1=int(user_id))
        game.put()

        # send information about game back to client
        self.response.write(game.json_data(user_id))

class JoinGame(RequestHandler):
    """Join a game by providing the game key."""

    def get(self):
        user_id = int(cgi.escape(self.request.get('user_id')))
        game_key = cgi.escape(self.request.get('game_key'))

        game = db.get(game_key)

        game.join(user_id)

        # send information about game back to client
        self.response.write(game.json_data(user_id))

class LeaveGame(RequestHandler):
    """Leave a game by providing the game key."""

    def get(self):
        user_id = int(cgi.escape(self.request.get('user_id')))
        game_key = cgi.escape(self.request.get('game_key'))

        game = db.get(game_key)

        game.delete()

        # send leave message to other user
        message = {
            'message': 'leave',
            'user_id': user_id
        }

        send(game.other_user(user_id), json.dumps(message))

class Message(RequestHandler):
    """Send a message to the other player in a game."""

    def get(self):
        user_id = int(cgi.escape(self.request.get('user_id')))
        game_key = cgi.escape(self.request.get('game_key'))
        message = cgi.escape(self.request.get("message"))

        game = Game.get(game_key)

        # send message to the other user in the game
        send(game.other_user(user_id), message)
