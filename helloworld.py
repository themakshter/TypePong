from webapp2 import RequestHandler, WSGIApplication
from google.appengine.ext import db
import cgi

class MainPage(RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.write("Hello, World!\n")
		self.response.write('\nAli was also here, hah (sorry about the \'breaking the whole thing\' bit tho)')
		self.response.write('\nTristan was here too!')

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

application = WSGIApplication([
	('/', MainPage),
	('/test', Test),
], debug=True)

def main():
	from paste import httpserver
	httpserver.serve(application, host='127.0.0.1', port='8080')

if __name__ == '__main__':
	main()


class Player(db.Model):#This is kinda like a table, it specifies what data is required etc
	name = db.StringProperty(required=True)#name required
	email = db.StringProperty(required=True)#email required etc

