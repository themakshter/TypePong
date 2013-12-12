from webapp2 import WSGIApplication
import main
import scores
import loginhandlers
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
    ('/_register', loginhandlers.Register),
    ('/_login', loginhandlers.Login),
    ('/_facebookLogin', loginhandlers.FacebookLogin),
    ('/_logout', loginhandlers.Logout),
    ('/_delete', loginhandlers.Delete),
    ('/_create', game.CreateGame),
    ('/_join', game.JoinGame),
    ('/_leave', game.LeaveGame),
    ('/_message', game.Message),
    ('/FBtest', main.FBTest),
    ('/_getUsername', loginhandlers.addUsername),
    ('/_facebookRegister', loginhandlers.facebookRegister)
    ], debug=True)
