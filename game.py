"""Game and messaging module that handles messages that should be sent between users in-game."""

from google.appengine.api import channel
from google.appengine.ext import db

from webapp2 import RequestHandler

import cgi
import json
import time

class Game(db.Model):
    """Stores current games available to join."""
    available = db.BooleanProperty(required=True, default=True)
    user_1 = db.StringProperty(required=True)
    ELO = db.IntegerProperty(required=True)
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
            'token': token,
            'opponent': self.other_user(user)
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

        player = db.GqlQuery("SELECT * FROM Player WHERE username =  :1", user)
        ELO = player.get().pvpRating
        if ELO == "":
            ELO = 0
        ranking = int(ELO)
        print "__________________"
        print ranking   #works to here.
        print "__________________"


        game = Game(key_name=user, user_1=user, ELO=ranking)
        game.put()

        # send information about game back to client
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(game.json_data(user))

class JoinGame(RequestHandler):
    """Join a game by providing the game key."""
    

    def post(self):
        user = cgi.escape(self.request.get('user'))
        # ELO = cgi.escape(self.request.get('ELO'))
        game_key = cgi.escape(self.request.get('game_key'))

        MAX_WAIT_TIME = 5
        acceptableDifference =10

        self.response.out.headers['Content-Type'] = 'application/json'
        # self.response.out.write(json.dumps({ 'game_found': False }))

        player = db.GqlQuery("SELECT * FROM Player WHERE username =  :1", user)
        ELO = player.get().pvpRating

        print "____________" + str(ELO)

        if ELO == "":
            ELO = 0
        ELO = int(ELO)

        if game_key == "":            
            game = 0
            startTime = time.time()
            timeSinceLastStep = startTime
            print "IN Join Game"
            while (1):
                games = db.GqlQuery("SELECT * FROM Game WHERE available = True")
                print games.count()
                # for g in games:
                    # print "Game available?" + str(g.available)
                    # print "game user 1: " + str(g.user_1)
                    # print "game user 2: " + str(g.user_2)
                # break
                if games.count() == 0:
                    print "no games"
                    break# if there's no games break, start your own one

                game = self.tryToMatch(user, games, acceptableDifference, ELO)#try to find a match
                if game != 0: # Game found
                    print "game found"
                    break

                if time.time() - timeSinceLastStep > (MAX_WAIT_TIME / 10):#over time increase acceptable difference
                    acceptableDifference = acceptableDifference +20
                    timeSinceLastStep = time.time();
                if time.time() - timeSinceLastStep > (MAX_WAIT_TIME * 0.9):
                    acceptableDifference = 2000#match with anyone if we're near the end
                
                if time.time() - startTime > MAX_WAIT_TIME:
                    print "TOO LONG"
                    # self.response.out.write(json.dumps({ 'game_found': False })) 
                    break
        else:
            # else join the specified game
            game = db.get(game_key)

        # send information about game back to client
        
        
        if game:
            # a game was found, return game data
            print "Game Joined"
            game.join(user)
            self.response.out.write(game.json_data(user))
        else:
            # no game was found, return appropriate message
            print "no game found"
            self.response.out.write(json.dumps({ 'game_found': False }))

    def tryToMatch(self, user, games, acceptableDifference, playerELO):
        for g in games:
            # print "IN tryToMatch"

            # print "Acceptable difference: " + str(acceptableDifference)
            print "MY ELO:" + str(playerELO)
            print "GAME ELO" + str(g.ELO)
            print "ME" + str(user)
            print "GAME OWNER" + str(g.user_1)
            if g.user_1 == user:
                g.delete()
                return
                
            if abs(playerELO - g.ELO) <= acceptableDifference:
                    print "acceptable match found"
                    game = g
                    return game
        return 0
        

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
