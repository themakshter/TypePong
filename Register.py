from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
import cgi

import json

def genUserId():#dummy function. will give us unique ids 
    return 1


class MainPage(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Registeration\n")


        # uid=cgi.escape(self.request.get('uid'))

        name=cgi.escape(self.request.get('name'))
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))

        
        # people = db.GqlQuery("SELECT * FROM Player")

        if (name != "" and detail != "" and password != ""):
            # print
            # self.response.write("here")
            p = Player(user_id=genUserId(), name=name, login_detail=detail, secure_password=password,hi_score=0)#create a player
            p.put()#put into db
            self.response.write('\nsuccessfully regisetered\n')
        else:
            self.response.write("\nFailed to register user\n")


        people = db.GqlQuery("SELECT * FROM Player")

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

class Player(db.Model):
    #This is kinda like a table, it specifies what data is required etc


    user_id = db.IntegerProperty(required=True)
    name = db.StringProperty(required=True)
    login_detail = db.StringProperty(required=True)
    secure_password = db.StringProperty(required=True)
    hi_score =db.IntegerProperty(required=False)
    

with open('words.txt') as f:
    Sample = Sampler(f)

application = WSGIApplication([
    ('/Register', MainPage),
    ('/test', Test),
    ('/_load_words', LoadWords),
    ], debug=True)
