from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
import cgi
import json

class MainPage(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Hello, World!\n")
        self.response.write('\nAli was also here, hah (sorry about the \'breaking the whole thing\' bit tho)')
        self.response.write('\nTristan was here too!')
        self.response.write('\nso was Alex')
        self.response.write('\nSafe to assume Henco was probably here too')

class Test(RequestHandler):
    def get(self):
        f = open('test.html', 'r')
        self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())

class LoadWords(RequestHandler):
    def get(self):
        level = int(self.request.get('level'))
        words = Sample.sample(level)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(words))

with open('words.txt') as f:
    Sample = Sampler(f)
