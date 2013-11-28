from webapp2 import RequestHandler, WSGIApplication
import cgi
# import Cookie
import login
import json


class Login(RequestHandler):
    def post(self):
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))

        login_detail = str(detail)
        secure_password = password

        reply = {}
        try:
            # attempt to login
            name = login.login(login_detail, secure_password)
        except login.UserDoesNotExist as e:
            reply['username_error'] = e.msg
        except login.IncorrectPassword as e:
            reply['password_error'] = e.msg
        else:
            reply['success'] = "true"
            self.response.set_cookie("user", value=detail)
            self.response.set_cookie("name", value=name)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(reply))


class Register(RequestHandler):
    def post(self):
        name = cgi.escape(self.request.get('name'))
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))
        debug = cgi.escape(self.request.get("debug"))

        reply = {}
        try:
            login.register(name, detail, password)
        except (login.InvalidName, login.InvalidLoginDetail) as e:
            reply['username_error'] = e.msg
        except login.InvalidPassword as e:
            reply['password_error'] = e.msg
        else:
            reply['success'] = "true"
            self.response.set_cookie("user", value=detail)
            self.response.set_cookie("name", value=name)

        if debug != "" :
            people = login.list_users()
            self.response.write('\n [Debug]Displaying registered users: \n')
            for p in people:
                self.response.write('\nuid: ' + str(p.key()) + ', Name: ' + p.name + ',  loginDetail : ' + p.login_detail + ' score: ' + str(p.hi_score) + ', password: ' + p.secure_password)
                self.response.write(p.name)
        else:
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(reply))

class Logout(RequestHandler):
    def post(self):
        detail = cgi.escape(self.request.get("detail"))
        login_detail = str(detail)
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
