import string
import random
import hashlib

from google.appengine.ext import db
from google.appengine.ext.db import polymodel

from player import Player
from player import RegularPlayer
from player import FacebookPlayer

_min_length = 8

_hash_length = 64
_salt_length = 12

class LoginException(Exception):
    def __str__(self):
        return self.msg

class UserDoesNotExist(LoginException):
    def __init__(self, detail):
        self.msg = 'User %s does not exist with login detail' % detail

class InvalidName(LoginException):
    def __init__(self, name, msg):
        self.msg = 'Invalid name %s: %s' % (name, msg)

class InvalidLoginDetail(LoginException):
    def __init__(self, detail, msg):
        self.msg = 'Invalid login detail %s: %s' % (detail, msg)

class InvalidPassword(LoginException):
    def __init__(self, msg):
        self.msg = 'Invalid password: %s' % msg

class IncorrectPassword(LoginException):
    def __init__(self):
        self.msg = 'Incorrect password'

def _facebook_read_user(facebookID):
    '''returns data on a specific login detail. Raises a UserDoesNotExist exception if login detail doesn't exist'''

    # get rows from database
    # users = db.GqlQuery("SELECT * FROM FacebookPlayer WHERE facebookID =  :1", facebookID)

    for u in FacebookPlayer.all():
        if u.facebookID == facebookID:
            return u.username

    #only if no match does it exception
    # raise UserDoesNotExist()
    return ""

    # print()#need to redirect to get them a username
    # check user exists
    # if users.count() == 0:
        # print() #redirect to a page so they set a username


    # return users[0].username

        # raise UserDoesNotExist(username)


def _read_user(username):
    '''returns data on a specific login detail. Raises a UserDoesNotExist exception if login detail doesn't exist'''

    # get rows from database
    users = db.GqlQuery("SELECT * FROM Player WHERE username =  :1", username)

    # check user exists
    if users.count() == 0:
        raise UserDoesNotExist(username)

    # first 32 characters is hash
    pass_hash = users[0].password[:_hash_length]
    # everything afterwards is the salt
    salt = users[0].password[_hash_length:]

    return users[0].username, pass_hash, salt

def _write_user(username, pass_hash, salt):
    '''writes new user to users database'''
    RegularPlayer(username=username, password=str(pass_hash) + str(salt), campaignLevel=0, pvpRating=1500).put()

def _hash_password(password, salt):
    '''returns a salted and hashed password with the salt'''
    salted_pass = password + salt
    return hashlib.sha256(salted_pass).hexdigest()


def validate_name(name):
    '''tests if login name is valid'''
    if name == "":
        raise InvalidName(name, 'no name provided')

def facebook_validate_username(username):
    if username == "":
        raise InvalidLoginDetail(username, "no username provided")

    for u in Player.all():
        print (u.username + "             " + username)
        if u.username ==  username:
            raise InvalidLoginDetail(username, "user exists already")


def validate_username(detail):
    '''tests if login detail is valid'''
    if detail == "":
        raise InvalidLoginDetail(detail, 'no login detail provided')

    if user_exists(detail):
        raise InvalidLoginDetail(detail, 'login detail already exists')

def validate_password(password):
    '''tests if this is a valid password. Raises exceptions if invalid'''
    if password == "":
        raise InvalidPassword('no password provided')

    if len(password) < _min_length:
        raise InvalidPassword('must be at least %s characters' % _min_length)

def user_exists(detail):
    '''tests if this login detail is already in use'''
    try:
        _read_user(detail)
    except UserDoesNotExist:
        return False
    else:
        return True

def facebookRegister(facebookID, username):
    # self.response.write(facebookID)
    print (username)

    facebook_validate_username(username)

    FacebookPlayer(facebookID=facebookID, username=username, hiScore=0, campaignLevel=0, pvpRating=1500).put()


def register(username, password):
    '''registers a user. May raise InvalidLoginDetail or InvalidPassword'''


    # validate_name(name)
    validate_username(username)
    validate_password(password)

    salt = "".join([random.choice(string.hexdigits) for i in xrange(_salt_length)])
    pass_hash = _hash_password(password, salt)

    _write_user(username, pass_hash, salt)

def facebookLogin(facebookID):
    username = _facebook_read_user(facebookID)

    return username



def login(username, password):
    '''logs the user in, returns username if details are correct, otherwise raises a UserDoesNotExist or IncorrectPassword exception'''

    (this_username, this_pass, this_salt) = _read_user(username)

    pass_hash = _hash_password(password, this_salt)

    if not pass_hash == this_pass:
        raise IncorrectPassword()

    return this_username

def delete_user(detail):
    '''delete user with specified login detrail'''
    if detail == "":
        raise InvalidLoginDetail(detail, 'no login detail provided')

    if not user_exists(detail):
        raise InvalidLoginDetail(detail, 'login detail does not exist')

    deleted = []

    people = db.GqlQuery("SELECT * FROM Player WHERE login_detail = :1", detail)
    for p in people:
        deleted += [p.name]
        p.delete()

    return deleted

def list_users():
    '''returns a list of all user details'''
    # get rows from database
    return db.GqlQuery("SELECT * FROM Player")
