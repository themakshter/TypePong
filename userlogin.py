from webapp2 import RequestHandler, WSGIApplication
import cgi
import json
import login


class Login(RequestHandler):
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

class Register(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Registeration\n")
        # uid=cgi.escape(self.request.get('uid'))
        name=cgi.escape(self.request.get('name'))
        detail = cgi.escape(self.request.get("detail"))
        password = cgi.escape(self.request.get("pass"))

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

class Delete(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Deleting:\n")
        detail = cgi.escape(self.request.get("detail"))

        for name in login.delete_user(detail):
            self.response.write("\nDeleting " + name)
