from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
import player
import cgi
import json

class Verify(RequestHandler):
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

class Register(RequestHandler):
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
