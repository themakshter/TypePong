from webapp2 import WSGIApplication
from main import MainPage, Test, LoadWords
from scores import UpdateScore
from userlogin import Register, Verify

app = WSGIApplication([
    ('/', MainPage),
    ('/test', Test),
    ('/loadwords', LoadWords),
    ('/updatescore', UpdateScore),
    ('/register', Register),
    ('/verify', Verify),
    ], debug=True)