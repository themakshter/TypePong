from webapp2 import WSGIApplication
import main
import scores
from userlogin import Register, Verify, Delete
from game import CreateGame, JoinGame, LeaveGame, Message

app = WSGIApplication([
    ('/', main.MainHandler),
    ('/about', main.AboutHandler),
    ('/login', main.LoginHandler),
    ('/pong', main.GameHandler),
    ('/hiscores', main.HiscoresHandler),
    # pages the user shouldn't be accessing
    ('/_loadwords', main.LoadWords),
    ('/_updatescore', scores.UpdateScore),
    ('/_register', Register),
    ('/_verify', Verify),
    ('/_delete', Delete),
    ('/_create', CreateGame),
    ('/_join', JoinGame),
    ('/_leave', LeaveGame),
    ('/_message', Message)
    ], debug=True)
