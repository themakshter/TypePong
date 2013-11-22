from webapp2 import WSGIApplication
import main
import scores
import userlogin

app = WSGIApplication([
    ('/', main.MainHandler),
    ('/about', main.AboutHandler),
    ('/login', main.LoginHandler),
    ('/pong', main.GameHandler),
    ('/hiscores', main.HiscoresHandler),
    # pages the user shouldn't be accessing
    ('/_loadwords', main.LoadWords),
    ('/_updatescore', scores.UpdateScore),
    ('/_register', userlogin.Register),
    ('/_verify', userlogin.Login),
    ('/_delete', userlogin.Delete),
    ], debug=True)