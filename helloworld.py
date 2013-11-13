from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication

import json

class MainPage(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Hello, World!\n")

class Test(RequestHandler):
    def get(self):
        f = open('test.html', 'r')
        self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())

class LoadWords(RequestHandler):
    def get(self):
        level = self.request.get('level')
        words = Sample.sample(level)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(words))

application = WSGIApplication([
    ('/', MainPage),
    ('/test', Test),
    ('/_load_words', LoadWords),
], debug=True)

Sample = Sampler()
