from webapp2 import WSGIApplication
from main import MainHandler, LoginHandler, GameHandler, LoadWords, AboutHandler
from scores import UpdateScore
from userlogin import Register, Verify, Delete

app = WSGIApplication([
    ('/', MainHandler),
    ('/about', AboutHandler),
    ('/login', LoginHandler),
    ('/pong', GameHandler),
    # pages the user shouldn't be accessing
    ('/_loadwords', LoadWords),
    ('/_updatescore', UpdateScore),
    ('/_register', Register),
    ('/_verify', Verify),
    ('/_delete', Delete),
    ], debug=True)