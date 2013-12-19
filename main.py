from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from player import Player
from player import RegularPlayer
from google.appengine.ext.db import polymodel

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
        self.response.write(self.get_main_page(self.request.cookies))

    def get_main_page(self, cookies):
        string = "Login/Register" if "user" not in cookies.keys() else "Go Play!"
        return render_template("main.html", {'linktext':string})

class Sidebar(RequestHandler):
    def get(self, request=None, response=None):
        self.response.write(render_template("sidebar.html"))

class LoginHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" in self.request.cookies.keys():
            self.redirect("/campaign")
        else:
            page = self.get_login_page()
            self.response.out.write(page)

    def get_login_page(self, args={}):
        return render_template('login.html')


class CampaignHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" not in self.request.cookies.keys():
            self.redirect("/login")
        values = {'name': self.request.cookies.get("user")}
        page = render_template('pong_campaign.html', values)
        self.response.out.write(page)

class ChallengeHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" not in self.request.cookies.keys():
            self.redirect("/login")
        values = {'name': self.request.cookies.get("user")}
        page = render_template('pong_challenge.html', values)
        self.response.out.write(page)

class PvpHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" not in self.request.cookies.keys():
            self.redirect("/login")
        values = {'name': self.request.cookies.get("user")}
        page = render_template('pong_pvp.html', values)
        self.response.out.write(page)

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
                username = p.username,
                score = p.hiScore)
            players.append(player)
        # players.append(dict(username="tristan", score=2))
        content = table_template.render(players = players)
        self.response.out.write(content)


def getHiscorePlayers(start, count):
    return Player.all().order("-hiScore").run(offset=start, limit=count)
    # return RegularPlayer.all()

class LoadWords(RequestHandler):
    def get(self):
        level = int(self.request.get('level'))
        with open('words.txt') as f:
            Sample = Sampler(f)
            words = Sample.sample(level)

            self.response.headers['Content-Type'] = 'application/json'
            self.response.headers['Access-Control-Allow-Origin'] = '*'
            self.response.out.write(json.dumps(words))

def render_template(template_path, values={}):
    template = get_template(template_path);
    return template.render(values)

def get_template(name):
    jinja_environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
    return jinja_environment.get_template(name);
