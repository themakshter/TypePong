from google.appengine.ext import db
from google.appengine.ext.db import polymodel

class Player(polymodel.PolyModel):
    # This is kinda like a table, it specifies what data is required etc
    # name = db.StringProperty(required=True)

    #should be username

    username = db.StringProperty(required=True)

    campaignLevel = db.IntegerProperty(required=True)
    pvpRating = db.IntegerProperty(required=True)
    challengeScore = db.StringProperty()
    hiScore = db.IntegerProperty()

class RegularPlayer(Player):
    password = db.StringProperty(required=True)

class FacebookPlayer(Player):
    facebookID = db.StringProperty(required=True)
