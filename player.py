from google.appengine.ext import db

class Player(db.Model):
    # This is kinda like a table, it specifies what data is required etc
    user_id = db.IntegerProperty(required=True)
    name = db.StringProperty(required=True)
    login_detail = db.StringProperty(required=True)
    secure_password = db.StringProperty(required=True)
    hi_score =db.IntegerProperty(required=False)

def genUserId(): # dummy function. will give us unique ids 
    return 1