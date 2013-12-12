from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
from google.appengine.ext.db import polymodel
import cgi
import json
import random

class UpdateScore(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'

        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("hiScore"))
        username = str(username)
        hiScore = int(score)

        if (not username == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.hiScore = hiScore
                u.put()

def newRankings(myScore, theirScore, points):#points will be 1 or 0
    #eA = 1/1+10^(theirs-mine)/400

    k=32

    eAdenomiator = 1+10**((theirScore-myScore)/400)
    eA = 1/eAdenomiator;


    eBdenomiator = 1+10**((myScore-theirScore)/400)
    eB = 1/eBdenomiator;

    newMyScore = myScore + k*(points-eA)

    newTheirScore = theirScore+ k*(1-points-eB);

    return newMyScore, newTheirScore

class UpdatePVPRating(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'

        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("pvpRating"))
        opponent= cgi.escape(self.request.get("oppositionUsername"))
        winner = cgi.escape(self.request.get("winner"))


        winner=str(winner)
        username = str(username)
        pvpRating = int(score)
        opponent = str(opponent)

        if winner == username:
            points =1
        elif winner == opponent:
            points =0
        else:
            print "SHITFUCKSHIT"#TODO die here.

        if (not opponent == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", opponent)
            for u in users:
                opponentPVPRating = u.pvpRating;

        newRankings(pvpRating, opponentPVPRating, points)

        if (not username == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.pvpRating = pvpRating
                u.put()

        if (not username == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", opponent)
            for u in users:
                u.pvpRating = opponentPVPRating
                u.put()

class UpdateCampaignLevel(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'

        username = cgi.escape(self.request.get("username"))
        campaignLevel = cgi.escape(self.request.get("campaignLevel"))

        username = str(username)
        campaignLevel = int(campaignLevel)

        if (not username == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.campaignLevel = campaignLevel
                u.put()
