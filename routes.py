from webapp2 import WSGIApplication
import main
import scores
import loginhandlers
import game

app = WSGIApplication([
    ('/', main.MainHandler),
    ('/about', main.AboutHandler),
    ('/login', main.LoginHandler),
    ('/campaign', main.CampaignHandler),
    ('/challenge', main.ChallengeHandler),
    ('/pvp', main.PvpHandler),
    ('/sidebar', main.Sidebar),
    # pages the user shouldn't be accessing
    ('/_loadwords', main.LoadWords),
    ('/_loadcampaignlevel', scores.LoadCampaignLevel),
    ('/hiscores_campaign', scores.HiscoresCampaignHandler),
    ('/hiscores_challenge', scores.HiscoresChallengeHandler),
    ('/_updatescore', scores.UpdateScore),
        ('/_updatepvprating', scores.UpdatePVPRating),
        ('/_updatecampaignlevel', scores.UpdateCampaignLevel),
        ('/_updatechallengescore', scores.UpdateChallengeScore),
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
