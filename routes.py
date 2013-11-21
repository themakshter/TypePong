from webapp2 import WSGIApplication
from main import MainPage, Test, LoadWords
from scores import UpdateScore
from userlogin import Register, Verify

app = WSGIApplication([
    ('/', MainPage),
    ('/test', Test),
    ('/_loadwords', LoadWords),
    ('/_updatescore', UpdateScore),
    ('/_register', Register),
    ('/_verify', Verify),
    ], debug=True)