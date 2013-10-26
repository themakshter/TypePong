import csv
import string
import random
import hashlib

_file = 'users.csv'

_min_length = 8
_salt_length = 12

class LoginException(Exception):
    def __str__(self):
        return self.msg

class UsernameDoesNotExist(LoginException):
    def __init__(self, username):
        self.msg = 'Username %s does not exist' % username

class InvalidUsername(LoginException):
    def __init__(self, username, msg):
        self.msg = 'Invalid username %s: %s' % username, msg

class InvalidPassword(LoginException):
    def __init__(self, msg):
        self.msg = 'Invalid password: %s' % msg

def _read_user(username):
    '''returns data on a specific username. Raises a UsernameDoesNotExist exception if username doesn't exist'''
    for this_user, this_pass, this_salt in csv.reader(open(_file, 'r')):
        if username == this_user:
            return this_user, this_pass, this_salt

    raise UsernameDoesNotExist(username)

def _write_user(username, pass_hash, salt):
    '''writes new user to users database'''
    writer = csv.writer(open(_file, 'a+'))
    writer.writerow((username, pass_hash, salt))

def validate_username(username):
    '''tests if username is valid'''
    if username_exists(username):
        raise InvalidUsername(username, 'username already exists')

def validate_password(password):
    '''tests if this is a valid password. Raises exceptions if invalid'''
    if len(password) < _min_length:
        raise InvalidPassword('must be at least %s characters' % _min_length)

def username_exists(username):
    '''tests if this username is already in use'''
    try:
        _read_user(username)
    except UsernameDoesNotExist:
        return False
    else:
        return True

def hash_password(password, salt):
    '''returns a salted and hashed password with the salt'''
    salted_pass = password + salt
    return hashlib.sha256(salted_pass).hexdigest()

def register(username, password):
    '''registers a user. May raise InvalidUsername or InvalidPassword'''
    validate_username(username)
    validate_password(password)

    salt = "".join([random.choice(string.hexdigits) for i in xrange(_salt_length)])
    pass_hash = hash_password(password, salt)

    _write_user(username, pass_hash, salt)

def login(username, password):
    '''logs the user in, returns false if password is incorrect and raises a UsernameDoesNotExist exception if username doesn't exist'''

    this_user, this_pass, this_salt = _read_user(username)

    pass_hash = hash_password(password, this_salt)

    if pass_hash == this_pass:
        return True
    else:
        return False
