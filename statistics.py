from google.appengine.ext import db
from google.appengine.ext.db import polymodel

class Statistics(polymodel.PolyModel):
    username = db.StringProperty(required=True)
    date = db.DateTimeProperty(required=True)

class ChallengeStats(Statistics):
    survived = db.StringProperty(required=True)

class PvPStats(Statistics):
    opponent = db.StringProperty(required=True)
    rating_change = db.IntegerProperty(required=True)
