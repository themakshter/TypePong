import webapp2

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("Hello, World!\n")
        self.response.write('\nAli was also here, hah (sorry about the \'breaking the whole thing\' bit tho)')

class Test(RequestHandler):
	def get(self):
		template = Template(filename='test.html')
        self.response.headers['Content-Type'] = 'text/html'
        self.response.write(template.render())

application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/test', Test),
], debug=True)
