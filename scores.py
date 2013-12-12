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
				
class UpdatePVPRating(RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'

        username = cgi.escape(self.request.get("username"))
        score = cgi.escape(self.request.get("pvpRating"))
		
        username = str(username)
        pvpRating = int(score)

        if (not username == ""):
            users = db.GqlQuery("SELECT * FROM Player WHERE username = :1", username)
            for u in users:
                u.pvpRating = pvpRating
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
