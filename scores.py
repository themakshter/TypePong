from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
from google.appengine.ext.db import polymodel
import cgi
import json
import random

class UpdateScore(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'

        username = cgi.escape(self.request.get("username"))
        # userName = str(detail)
        # self.response.write(username)
        hiScore = 13

        if (not username == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            # for u in users:
                # self.response.write(u.username)
                # u.hiScore = random.randrange(100)
                # u2 = Player(user_id=u.user_id, name=u2.name, login_detail=u2.login_detail, secure_password=u2.secure_password,hi_score=10)
                # u2 = Player(user_id=1, name=name, login_detail=detail, secure_password=password,hi_score=10)#create a player
                # self.response.write(u2)
                # u.put()

        # self.response.write("hi")
        people = db.GqlQuery("SELECT * FROM Player")
        # db.delete(db.Query())
        self.response.write(people.count())
        # self.response.write(people[0].username)
        # self.response.write(people[1].username)
        # self.response.write(people[2].username)
        # for p in people:
        #     self.response.write('\nkey: ' + str(p.key()) + '\t\tusername: ' + p.username + '\t\tscore: ' + str(p.hiScore))

        # self.response.write(qry)
        # users = db.GqlQuery("SELECT * FROM Player WHERE login_detail =  :1", detail)
        # #         # users = Player.all()
        # # # users.filter("login_detail =",login_detail)

        # if users.count() == 0:
        #     self.response.write("\n no user with those details")
        # if users.count() >1:
        #     self.response.write("\nError, many users with this name")

        # # self.response.write(users.count())

        # count = 0
        # for u in users:
        #     # self.response.write("\nhere")
        #     # count = count +1
        #     # if(count>1):

        #     if(u.secure_password==secure_password):
        #         # we have a match for the user
        #         self.response.write("\nThis is a registered user, name = " + u.name)
        #     else:
        #         self.response.write("\n Incorrent pass")
