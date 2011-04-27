#!/usr/bin/python
 # -*- coding: utf-8 -*-

import tweepy, sqlite3, random, json

class db(object):

	def __init__(self):
		self.handle	= sqlite3.connect('db')
		self.handle
		self.cursor	= self.handle.cursor()


class user(object):

	def __init__(self):
		self.db = db()

	def all(self):
		"""
		Retrieves all user names.
		"""
		all = []
		for u in self.db.handle.execute('SELECT name FROM user'):
			all.append(u[0])
		return all

class auth(object):

	def __init__(self):
		self.db 	= db()
		self.api	= False
		self.app 	= {
			'key' : 'BPVXX4aiENvekKbL7Bw',
			'pwd' : 'HewD2JmbTeBuZokm4L6Cee1Z1U4MZyuzG3ntn3VMvTY'
		}
		self.usr 	= {
			'key' : False,
			'pwd' : False
		}
		self.tkn	= {
			'key' : False,
			'pwd' : False
		}
		self.oauth = False


	def request(self):
		"""
		Start a session with twitter server.
		"""
		self.oauth = tweepy.OAuthHandler(self.app['key'], self.app['pwd'])
		url = self.oauth.get_authorization_url()
		self.tkn['key'] = self.oauth.request_token.key;
		self.tkn['pwd'] = self.oauth.request_token.key;
		# generate a random session id an send it to the browser to identify this.
		sess =  random.randint(1,99999999)
		sql = 'INSERT INTO session (id,key,secret) VALUES (?,?,?)'
		self.db.cursor.execute(sql, (sess, self.tkn['key'], self.tkn['pwd']))
		self.db.handle.commit()
		self.db.cursor.close()
		return json.dumps({ 'sess' : sess, 'url' : url })


	def signin(self, sess, token):
		"""
		Verify authorization with twitter, and if correct, add it to DB
		"""
		self.oauth = tweepy.OAuthHandler(self.app['key'], self.app['pwd'])
		# get session from db
		sql = 'SELECT * FROM session WHERE id=?'
		self.db.cursor.execute(sql, [int(sess)])
		sess, key, pwd  = self.db.cursor.fetchone()
		self.db.cursor.close()
		# set request tokens
		self.oauth.set_request_token(str(key), str(pwd))
		self.oauth.get_access_token(token)
		self.usr['key'] = self.oauth.access_token.key
		self.usr['pwd'] = self.oauth.access_token.secret
		self.api = tweepy.API(self.oauth)
		usr = self.api.me()
		# store them in database for later use
		sql = 'INSERT INTO user (name,key,secret) VALUES(?,?,?)'
		self.db.cursor.execute(sql,(usr.screen_name, self.usr['key'], self.usr['pwd']))
		self.db.handle.commit()
		self.db.cursor.close()
		return usr.screen_name

	def signout(self, user):
		"""
		Removes user from DB
		"""
		self.db.cursor.execute('DELETE FROM user WHERE name=?', [user])
		self.db.handle.commit()
		self.db.cursor.close()
		return user
