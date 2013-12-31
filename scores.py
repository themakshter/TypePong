from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
from google.appengine.ext.db import polymodel

import cgi


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


class UpdateScore(RequestHandler):
    def post(self):
        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("hiScore"))
        username = str(username)
        hiScore = int(score)

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.hiScore = hiScore
                u.put()

class UpdateChallengeScore(RequestHandler):
    def post(self):
        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("timeSurvived"))

        username = str(username)
        time_survived = self.parseTime(int(score))
        print int(score)
        print time_survived

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1",
                username)
            for u in users:
                u.challengeScore = time_survived
                u.put()

    def parseTime(self, time):
        minute, second = str(time / 60), str(time % 60)

        return minute.zfill(2) + ':' + second.zfill(2)

class UpdatePVPRating(RequestHandler):
    def post(self):
        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("pvpRating"))
        opponent= cgi.escape(self.request.get("oppositionUsername"))
        winner = cgi.escape(self.request.get("winner"))

        winner = str(winner)
        username = str(username)
        pvpRating = int(score)
        opponent = str(opponent)

        if winner == username:
            points = 1
        elif winner == opponent:
            points = 0
        else:
            print "SHITFUCKSHIT"#TODO die here.

        if opponent:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", opponent)
            for u in users:
                opponentPVPRating = u.pvpRating;

        newRankings(pvpRating, opponentPVPRating, points)

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.pvpRating = pvpRating
                u.put()

        if opponent:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", opponent)
            for u in users:
                u.pvpRating = opponentPVPRating
                u.put()

class UpdateCampaignLevel(RequestHandler):
    def post(self):
        username = cgi.escape(self.request.get("username"))
        campaignLevel = cgi.escape(self.request.get("campaignLevel"))

        username = str(username)
        campaignLevel = int(campaignLevel)

        if username:
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.campaignLevel = campaignLevel
                u.put()
