from webapp2 import WSGIApplication
import main
import scores
import userlogin
import game

app = WSGIApplication([
    ('/', main.MainHandler),
    ('/about', main.AboutHandler),
    ('/login', main.LoginHandler),
    ('/game', main.GameHandler),
    ('/hiscores', main.HiscoresHandler),
    ('/sidebar', main.Sidebar),
    # pages the user shouldn't be accessing
    ('/_loadwords', main.LoadWords),
    ('/_updatescore', scores.UpdateScore),
	('/_updatepvprating', scores.UpdatePVPRating),
	('/_updatecampaignlevel', scores.UpdateCampaignLevel),
    ('/_register', userlogin.Register),
    ('/_login', userlogin.Login),
    ('/_facebookLogin', userlogin.FacebookLogin),
    ('/_logout', userlogin.Logout),
    ('/_delete', userlogin.Delete),
    ('/_create', game.CreateGame),
    ('/_join', game.JoinGame),
    ('/_leave', game.LeaveGame),
    ('/_message', game.Message),
    ('/FBtest', main.FBTest),
    ('/_getUsername', userlogin.addUsername),
    ('/_facebookRegister', userlogin.facebookRegister)
    ], debug=True)
