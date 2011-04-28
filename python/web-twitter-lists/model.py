#!/usr/bin/python
 # -*- coding: utf-8 -*-

import config, tweepy, sqlite3, random, json

class database(object):

	def __init__(self):
		self.handle	= sqlite3.connect('db')
		self.handle
		self.cursor	= self.handle.cursor()

	def __del__(self):
		self.handle.commit()
		self.cursor.close()

class lista(object):

	def __init__(self):
		self.db = database()

	def getall(self, user):
		# check if this user has stored lists first.
		sql = 'SELECT id_user FROM user WHERE name=?'
		id_user = self.db.cursor.execute(sql, [str(user)]).fetchone()
		if not id_user or len(id_user) < 1: return False
		id_user = str(id_user[0])
		# fetch existing lists
		sql = 'SELECT id_list,name FROM list WHERE id_user=?'
		lst = self.db.cursor.execute(sql, [str(id_user)]).fetchall()
		# fetch lists from server, store the, in database
		lista = []
		if len(lst) < 1:
			my = auth().login(user).me()
			lista  = []
			for l in my.lists()[0]:
				sql = 'INSERT INTO list (id_list, id_user, name) VALUES (?, ?, ?)'
				self.db.cursor.execute(sql, (l.id, my.id, l.name))
				tmp = { 'id':l.id, 'name': l.name, 'members':[] }
				for m in l.members()[0]:
					sql = 'INSERT INTO member (id_member, id_list, name) VALUES (?, ?, ?)'
					self.db.cursor.execute(sql, (m.id, l.id, m.screen_name))
					tmp['members'].append((m.id, m.screen_name))
				lista.append(tmp)
		else:
			for L in lst:
				list_id, list_name = [str(i) for i in L]
				# fetch all usernames for this list
				sql = 'SELECT id_member,name FROM member WHERE id_list=?'
				mem = self.db.cursor.execute(sql, [str(list_id)]).fetchall()
				if len(mem) < 1: return False
				lista.append({
					'id'     : list_id,
					'name'   : list_name,
					'members': [[str(b) for b in a] for a in mem]
				})
		return lista




class user(object):

	def __init__(self):
		self.db = database()

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
		self.db 	= database()
		self.api	= False
		self.app 	= {
			'key' : str(config.key),
			'pwd' : str(config.pwd)
		}
		self.usr 	= {
			'key' : False,
			'pwd' : False
		}
		self.tkn	= {
			'key' : False,
			'pwd' : False
		}
		self.oauth = tweepy.OAuthHandler(self.app['key'], self.app['pwd'])



	def login(self, user):
		sql = 'SELECT key,pwd FROM user WHERE name=?'
		self.db.cursor.execute(sql, [str(user)])
		key,pwd = self.db.cursor.fetchone()
		self.oauth.set_access_token(str(key), str(pwd))
		self.api = tweepy.API(self.oauth)
		return self.api

	def kill(self, sess):
		sql = 'DELETE FROM session WHERE id=?'
		self.db.cursor.execute(sql, [int(sess)])
		return sess

	def request(self,sess):
		"""
		Start a session with twitter server.
		"""
		url = self.oauth.get_authorization_url()
		self.tkn['key'] = self.oauth.request_token.key;
		self.tkn['pwd'] = self.oauth.request_token.key;
		# generate a random session id an send it to the browser to identify this.
		sql = 'INSERT INTO session (id,key,pwd) VALUES (?,?,?)'
		self.db.cursor.execute(sql, (int(sess), self.tkn['key'], self.tkn['pwd']))
		return json.dumps({ 'sess' : sess, 'url' : url })


	def signin(self, sess, token):
		"""
		Verify authorization with twitter, and if correct, add it to DB
		"""
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
		sql = 'INSERT INTO user (id_user,name,key,pwd) VALUES(?,?,?,?)'
		self.db.cursor.execute(sql,(usr.id, usr.screen_name, self.usr['key'], self.usr['pwd']))
		# remove session from database
		self.db.cursor.execute('DELETE FROM session WHERE id=?', [int(sess)])
		return usr.screen_name

	def signout(self, user):
		"""
		Removes user from DB
		"""
		self.db.cursor.execute('DELETE FROM user WHERE name=?', [user])
		return user
