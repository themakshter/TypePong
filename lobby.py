from google.appengine.ext import db
from google.appengine.ext.db import polymodel
from game import Game
from player import Player
from utils import render_template, get_template
from webapp2 import RequestHandler

import cgi
import json

class LobbyHandler(RequestHandler):
    def get(self):
        lobby_template = get_template("lobby.html")
        username = str(self.request.cookies.get('user'))

        games = Game.all().filter("available =", True).run()
        values = {'games': games, 'name': username}

        content = lobby_template.render(values)
        self.response.out.write(content)
