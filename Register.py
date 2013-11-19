from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
import cgi

import json

import login

class MainPage(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Registeration\n")


        # uid=cgi.escape(self.request.get('uid'))

        name=cgi.escape(self.request.get('name'))
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))


        # people = db.GqlQuery("SELECT * FROM Player")

        try:
            login.register(name, detail, password)
        except login.LoginException:
            self.response.write("\nFailed to register user\n")
        else:
            self.response.write('\nsuccessfully regisetered\n')


        people = login.list_users()

        self.response.write('\n [Debug]Displaying registered users: \n')
        for p in people:
            self.response.write('\nuid: ' + str(p.user_id) + ', Name: ' + p.name + ',  loginDetail : ' + p.login_detail + ' score: ' + str(p.hi_score))
            self.response.write(p.name)
            # db.delete(p) #uncomment to delete entries

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
    ('/Register', MainPage),
    ('/test', Test),
    ('/_load_words', LoadWords),
    ], debug=True)
