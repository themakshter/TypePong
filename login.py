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

class UserDoesNotExist(LoginException):
    def __init__(self, detail):
        self.msg = 'User %s does not exist with login detail' % detail

class InvalidLoginDetail(LoginException):
    def __init__(self, detail, msg):
        self.msg = 'Invalid login detail %s: %s' % detail, msg

class InvalidPassword(LoginException):
    def __init__(self, msg):
        self.msg = 'Invalid password: %s' % msg

def _read_user(detail):
    '''returns data on a specific login detail. Raises a UserDoesNotExist exception if login detail doesn't exist'''
    for this_name, this_detail, this_pass, this_salt in csv.reader(open(_file, 'r')):
        if detail == this_detail:
            return this_name, this_detail, this_pass, this_salt

    raise UserDoesNotExist(detail)

def _write_user(name, detail, pass_hash, salt):
    '''writes new user to users database'''
    writer = csv.writer(open(_file, 'a+'))
    writer.writerow((name, detail, pass_hash, salt))

def validate_detail(detail):
    '''tests if login detail is valid'''
    if detail_exists(detail):
        raise InvalidLoginDetail(detail, 'login detail already exists')

def validate_password(password):
    '''tests if this is a valid password. Raises exceptions if invalid'''
    if len(password) < _min_length:
        raise InvalidPassword('must be at least %s characters' % _min_length)

def detail_exists(detail):
    '''tests if this login detail is already in use'''
    try:
        _read_user(detail)
    except UserDoesNotExist:
        return False
    else:
        return True

def hash_password(password, salt):
    '''returns a salted and hashed password with the salt'''
    salted_pass = password + salt
    return hashlib.sha256(salted_pass).hexdigest()

def register(name, detail, password):
    '''registers a user. May raise InvalidLoginDetail or InvalidPassword'''
    validate_detail(detail)
    validate_password(password)

    salt = "".join([random.choice(string.hexdigits) for i in xrange(_salt_length)])
    pass_hash = hash_password(password, salt)

    _write_user(name, detail, pass_hash, salt)

def login(detail, password):
    '''logs the user in, returns false if password is incorrect and raises a UserDoesNotExist exception if login detail doesn't exist'''

    (this_name, this_detail, this_pass, this_salt) = _read_user(detail)

    pass_hash = hash_password(password, this_salt)

    if pass_hash == this_pass:
        return True
    else:
        return False
