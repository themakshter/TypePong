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
        self.response.write("Hello, World!\n")
        self.response.write('\nuse HTTP GET with varibles detail=x and pass=y')
        self.response.write("\n try ?detail=Alex&pass=Alex\n\n")


        # uid=cgi.escape(self.request.get('uid'))

        name=cgi.escape(self.request.get('name'))
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))

        login_detail =str(detail)
        secure_password = password

        
        # self.response.write(qry)
        users = db.GqlQuery("SELECT * FROM Player WHERE login_detail =  :1", detail)
        #         # users = Player.all()
        # # users.filter("login_detail =",login_detail)

        if users.count() == 0:
            self.response.write("\n no user with those details")
        if users.count() >1:
            self.response.write("\nError, many users with this name")

        # self.response.write(users.count())

        count = 0
        for u in users:
            # self.response.write("\nhere")
            # count = count +1
            # if(count>1):
                
            if(u.secure_password==secure_password):
                # we have a match for the user
                self.response.write("\nThis is a registered user, name = " + u.name)
            else:
                self.response.write("\n Incorrent pass")


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
    ('/verify', MainPage),
    ('/test', Test),
    ('/_load_words', LoadWords),
    ], debug=True)
