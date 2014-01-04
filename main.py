from google.appengine.ext.db import polymodel
from player import Player, RegularPlayer
from sampler import Sampler
from utils import render_template, get_template
from webapp2 import RequestHandler, WSGIApplication

import json
import cgi

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

class FBLoginHandler(LoginHandler):
    def get_login_page(self, args={}):
        facebookID = cgi.escape(self.request.get("facebookID"))
        values = {'fbid': facebookID}
        return render_template('facebook_login.html', values)

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

class LoadWords(RequestHandler):
    WordSampler = Sampler(open('words.txt'))

    def get(self):
        level = int(self.request.get('level'))

        words = self.WordSampler.sample(level)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(words))
