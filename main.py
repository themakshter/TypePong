from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
from player import Player


import json
import os
import jinja2


class FBTest(RequestHandler):
    def get(self):
        f = open("FBtest.html", "r")
        self.response.write(f.read())

class AboutHandler(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Hello, World!\n")
        self.response.write('\nAli was also here, hah (sorry about the \'breaking the whole thing\' bit tho)')
        self.response.write('\nTristan was here too!')
        self.response.write('\nso was Alex')
        self.response.write('\nSafe to assume Henco was probably here too')

class MainHandler(RequestHandler):
    def get(self, request=None, response=None):
        self.response.out.write(get_page('main.html'))

        # request = Request.blank('/')
        userDetail= self.request.cookies.get("user")
        name = self.request.cookies.get("name")
        self.response.write(userDetail)
        self.response.write("\n")
        self.response.write(name)

class LoginHandler(RequestHandler):
    def get(self, request=None, response=None):
        self.response.out.write(get_page('login.html'))

class GameHandler(RequestHandler):
    def get(self, request=None, response=None):
        self.response.out.write(get_page('pong.html'))

class HiscoresHandler(RequestHandler):
    def get(self, request=None, response=None):
        page = 0
        score_per_page = 5
        start = page * score_per_page
        players_q = getHiscorePlayers(start, score_per_page)
        table_template = get_template("hiscores.html");
        players = []
        for p in players_q:
            player = dict(
                uid = str(p.key()),
                name = p.name,
                score = p.hi_score)
            players.append(player)
        content = table_template.render(players = players)
        template = get_default_template();
        vals = {'content': content}
        self.response.out.write(template.render(vals))


def getHiscorePlayers(start, count):
    return Player.all().order("-hi_score").run(offset=start, limit=count)

class LoadWords(RequestHandler):
    def get(self):
        level = int(self.request.get('level'))
        words = Sample.sample(level)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(words))

with open('words.txt') as f:
    Sample = Sampler(f)

def get_page(path):
    template = get_default_template();
    vals = {'content': open('templates/' + path).read()}
    return template.render(vals)

def get_default_template():
    return get_template('template.html');


def get_template(name):
    jinja_environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
    return jinja_environment.get_template(name);
