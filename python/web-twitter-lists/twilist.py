#!/usr/bin/python
 # -*- coding: utf-8 -*-

import web
import model

url = (
	'/(?!action|pub)([^/]*)', 'index',
	'/action/(.*)','action'
)

class index:

	def GET(self, uri):
		#if not uri: uri = 'World'
		render = web.template.render('html')
		users = model.user()
		return render.index(users.all())

class action:

	auth = False

	""" No GET requests please """
	def GET(self, uri):
		return web.badrequest()

	""" Redirect POST to methods [if existent] """
	def POST(self, uri):
		# method must exist & be actually a method
		if not hasattr(self, uri) or not callable(getattr(self, uri)):
			return web.badrequest()
		self.auth =  model.auth() # make sure you don't overwrite variables, dumbass.
		data = web.input()
		return eval('self.'+ uri)(data)

	def login(self, data):
		pass

	""" Request Twitter Access """
	def request(self, data):
		web.header('Content-Type', 'application/json');
		return self.auth.request();

	""" Register USER """
	def signin(self, data):
		if not data.token or not data.sess: return web.badrequest()
		return self.auth.signin(data.sess, data.token);

	""" Unregister USER """
	def signout(self, data):
		if not data.user: return web.badrequest()
		return self.auth.signout(data.user)




if __name__ == "__main__":
	app = web.application(url, globals())
	app.internalerror = web.debugerror
	app.run()
