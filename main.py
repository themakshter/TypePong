from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
import json
import os
import jinja2

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

class LoginHandler(RequestHandler):
    def get(self, request=None, response=None):
        self.response.out.write(get_page('login.html'))

class GameHandler(RequestHandler):
    def get(self, request=None, response=None):
        self.response.out.write(get_page('pong.html'))

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
    template = get_template();
    vals = {'content': open('templates/' + path).read()}
    return template.render(vals)

def get_template():
    jinja_environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
    return jinja_environment.get_template('template.html');