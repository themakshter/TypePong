from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
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
        self.response.write(self.get_main_page(self.request.cookies))

    def get_main_page(self, cookies):
        string = "Login/Register" if "user" not in cookies.keys() else "Go Play!"
        content = {'content': render_template("main.html", {'linktext':string})}
        return get_default_template().render(content)



class LoginHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" in self.request.cookies.keys():
            self.redirect("/game")
        else:
            page = self.get_login_page()
            self.response.out.write(page)

    def get_login_page(self, args={}):
        return get_page('login.html')

class GameHandler(RequestHandler):
    def get(self, request=None, response=None):
        if "user" not in self.request.cookies.keys():
            self.redirect("/login")
        values = {
            'left_content': "hello",
            'left_color': "white",
            'right_content': "world",
            'right_color': "green",
        }
        section = render_template('pong.html', values)
        page = get_default_template().render({'content': section})
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
                uid = p.login_detail,
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
        with open('words.txt') as f:
            Sample = Sampler(f)
            words = Sample.sample(level)

            self.response.headers['Content-Type'] = 'application/json'
            self.response.headers['Access-Control-Allow-Origin'] = '*'
            self.response.out.write(json.dumps(words))

def get_page(path):
    template = get_default_template();
    with open('templates/' + path) as t:
        vals = {'content': t.read()}
        return template.render(vals)

def render_template(template_path, values={}):
    template = get_template(template_path);
    return template.render(values)

def get_default_template():
    return get_template('template.html');


def get_template(name):
    jinja_environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
    return jinja_environment.get_template(name);
