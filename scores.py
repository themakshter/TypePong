from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
from player import Player, genUserId
import cgi
import json

class UpdateScore(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Hello, World!\n")

        # uid=cgi.escape(self.request.get('uid'))

        # name=cgi.escape(self.request.get('name'))
        # detail = cgi.escape(self.request.get("detail"))
        # password = cgi.escape(self.request.get("pass"))
        name = "Tristan"
        detail = "Alex"
        password = "Tristan"

        login_detail = str(detail)
        secure_password = password

        hi_score = 13

        users = db.GqlQuery("SELECT * FROM Player WHERE login_detail = :1", login_detail)
        self.response.write(users.count())
        for u in users:
            u.hi_score = hi_score
            # u2 = Player(user_id=u.user_id, name=u2.name, login_detail=u2.login_detail, secure_password=u2.secure_password,hi_score=10)
            # u2 = Player(user_id=1, name=name, login_detail=detail, secure_password=password,hi_score=10)#create a player
            # self.response.write(u2)
            u.put()


        people = db.GqlQuery("SELECT * FROM Player")
        for p in people:
            self.response.write('\nuid: ' + str(p.user_id) + ', Name: ' + p.name + ',  loginDetail : ' + p.login_detail + ' score: ' + str(p.hi_score))
        
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