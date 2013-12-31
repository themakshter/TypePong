from webapp2 import RequestHandler, WSGIApplication

from google.appengine.ext import db
from google.appengine.ext.db import polymodel

from player import Player
from player import RegularPlayer
from player import FacebookPlayer

import cgi

# import Cookie
import login
import json

class FacebookLogin(RequestHandler):
    def get(self):
        facebookID = cgi.escape(self.request.get("facebookID"))

        facebookID = str(facebookID)

        reply = {}
        print ("name:" + facebookID);

                  # attempt to login
        username = login.facebookLogin(facebookID)
        # except login.UserDoesNotExist as e:
        if username == "":
            self.redirect("/_getUsername?facebookID="+facebookID)
        else:
            reply['success'] = "true"
            self.response.set_cookie("user", value=username)
            player = db.GqlQuery("SELECT * FROM Player WHERE username =  :1", username)
            ELO = player.get().pvpRating
            self.response.set_cookie("ELO", value=ELO)
            # self.response.set_cookie("ELO", value=ELO)
            # self.response.set_cookie("name", value=name)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(reply))


class Login(RequestHandler):
    def post(self):
        username = cgi.escape(self.request.get("username"))
        password = cgi.escape(self.request.get("pass"))

        username = str(username)

        reply = {}
        try:
            # attempt to login
            username = login.login(username, password)
        except login.UserDoesNotExist as e:
            reply['username_error'] = e.msg
        except login.IncorrectPassword as e:
            reply['password_error'] = e.msg
        else:
            reply['success'] = "true"
            self.response.set_cookie("user", value=username)
            player = db.GqlQuery("SELECT * FROM Player WHERE username =  :1", username)
            ELO = player.get().pvpRating
            self.response.set_cookie("ELO", value=ELO)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(reply))

class addUsername(RequestHandler):
    def get(self):
        f = open("addUsername.html", "r")

        facebookID = cgi.escape(self.request.get("facebookID"))

        html = f.read()
        html = html.replace("__PLACEHOLDER__", facebookID)
        self.response.write(html);

class facebookRegister(RequestHandler):
    def post (self):
        facebookID = cgi.escape(self.request.get("facebookID"))
        username = cgi.escape(self.request.get("username"))
        # print("++++++++++++++++++++++++++++++++++++++++++++++++++2")
        # print (facebookID)
        # print (username)
        # print("+++++++++++++++++++++++++++++++++++++++++++++++++++")
        try :
            login.facebookRegister(facebookID, username)
        except login.InvalidLoginDetail as e:
            self.redirect("/_getUsername")
        else:
            self.response.set_cookie("user", value=username)
            self.redirect("/game")

class Register(RequestHandler):
    def post(self):
        # name = cgi.escape(self.request.get('name'))
        username = cgi.escape(self.request.get("username"))
        password = cgi.escape(self.request.get("pass"))
        debug = cgi.escape(self.request.get("debug"))

        reply = {}
        try:
            login.register(username, password)
        except (login.InvalidName, login.InvalidLoginDetail) as e:
            reply['username_error'] = e.msg
        except login.InvalidPassword as e:
            reply['password_error'] = e.msg
        else:
            reply['success'] = "true"
            self.response.set_cookie("user", value=username)
            # self.response.set_cookie("name", value=name)

        if debug != "" :
            people = login.list_users()
            self.response.write('\n [Debug]Displaying registered users: \n')
            for p in people:
                self.response.write('\nuid: ' + str(p.key()) +  ',  loginDetail : ' + p.username + ' score: ' + str(p.hiScore) + ', password: ' + p.password)
                self.response.write(p.name)
        else:
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(reply))

class Logout(RequestHandler):
    def get(self):
        self.response.delete_cookie("user")
        self.response.delete_cookie("name")
        self.redirect("/")

class Delete(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Deleting:\n")
        detail = cgi.escape(self.request.get("detail"))

        for name in login.delete_user(detail):
            self.response.write("\nDeleting " + name)
