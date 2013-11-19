from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
import cgi

import json

import login


class MainPage(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Hello, World!\n")
        self.response.write('\nuse HTTP GET with varibles detail=x and pass=y')
        self.response.write("\n try ?detail=Alex&pass=Alex\n\n")


        # uid=cgi.escape(self.request.get('uid'))

        name=cgi.escape(self.request.get('name'))
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))

        login_detail =str(detail)
        secure_password = password

        try:
            # attempt to login
            name = login.login(login_detail, secure_password)

        except login.UserDoesNotExist:
            self.response.write("\n no user with those details")

        except login.IncorrectPassword:
            self.response.write("\n Incorrent pass")

        else:
            # we have a match for the user
            self.response.write("\nThis is a registered user, name = " + name)


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

application = WSGIApplication([
    ('/verify', MainPage),
    ('/test', Test),
    ('/_load_words', LoadWords),
    ], debug=True)
