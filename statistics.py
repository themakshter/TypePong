from google.appengine.ext import db
from google.appengine.ext.db import polymodel

class Statistics(polymodel.PolyModel):
    ''' All statistics stored have a username and a date'''
    username = db.StringProperty(required=True)
    date = db.DateTimeProperty(required=True)

class ChallengeStats(Statistics):
    '''Challenge mode statistics store how long the player survived'''
    survived = db.StringProperty(required=True)

class PvPStats(Statistics):
    '''PvP stats store the opponent's name and rating'''
    opponent = db.StringProperty(required=True)
    rating_change = db.IntegerProperty(required=True)
