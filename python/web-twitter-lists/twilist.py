#!/usr/bin/python
 # -*- coding: utf-8 -*-

import web
import model

url = (
	'/(?!action|pub)([^/]*)', 'index',
	'/action/(.*)','action'
)

render = web.template.render('html')

class index:

	def GET(self, uri):
		#if not uri: uri = 'World'
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
		# make sure you don't overwrite variables, dumbass.
		self.auth =  model.auth()
		data = web.input()
		return eval('self.'+ uri)(data)

	def getall(self, data):
		if not data.user: return web.badrequest()
		lista = model.lista().getall(data.user)
		#if not lista: return web.badrequest()
		return render.lists(data.user, lista)

	def kill(self,data):
		if not data.sess: return web.badrequest()
		return self.auth.kill(data.sess)

	""" Request Twitter Access """
	def request(self, data):
		if not data.sess: web.badrequest()
		web.header('Content-Type', 'application/json')
		return self.auth.request(data.sess)

	""" Register USER """
	def signin(self, data):
		if not data.token or not data.sess: return web.badrequest()
		return self.auth.signin(data.sess, data.token)

	""" Unregister USER """
	def signout(self, data):
		if not data.user: return web.badrequest()
		return self.auth.signout(data.user)




if __name__ == "__main__":
	app = web.application(url, globals())
	app.internalerror = web.debugerror
	app.run()
