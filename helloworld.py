from sampler import Sampler
from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
import cgi

import json

class MainPage(RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.write("Hello, World!\n")
		self.response.write('\nAli was also here, hah (sorry about the \'breaking the whole thing\' bit tho)')
		self.response.write('\nTristan was here too!')
		self.response.write('\nso was Alex')

		name = cgi.escape(self.request.get("name"))
		email = cgi.escape(self.request.get("email"))
		# self.response.write(value)

		if (name != "" and email != ""):
			# print
			p = Player(name=name, email=email)#create a player
			p.put()#put into db


		people = db.GqlQuery("SELECT * FROM Player")

		for p in people:
			self.response.write('\n' + p.name + ', ' + p.email)
			# db.delete(p) #uncomment to delete entries

class Test(RequestHandler):
    def get(self):
        f = open('test.html', 'r')
        self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())

class LoadWords(RequestHandler):
    def get(self):
        level = int(self.request.get('level'))
        words = Sample.sample(level)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(words))

class Player(db.Model):
    """This is kinda like a table, it specifies what data is required etc"""
    name = db.StringProperty(required=True)#name required
    email = db.StringProperty(required=True)#email required etc

with open('words.txt') as f:
    Sample = Sampler(f)

application = WSGIApplication([
    ('/', MainPage),
    ('/test', Test),
    ('/_load_words', LoadWords),
    ], debug=True)
