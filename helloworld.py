from webapp2 import RequestHandler, WSGIApplication

class MainPage(RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.write("Hello, World!\n")
		self.response.write('\nAli was also here, hah (sorry about the \'breaking the whole thing\' bit tho)')

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