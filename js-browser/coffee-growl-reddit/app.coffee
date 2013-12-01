# Node libs
Exec = require('child_process').exec

# NPM libs
Reddit = require 'reddit-api'

auth = require './auth'

# Setup reddit
reddit = new Reddit 'gReddit v0.1 by /u/hamr23'
reddit.setIsLogging     false
reddit.setDispatchMode 'limited'

# Configuration
limit  = 100
timer  = 120  # seconds

# Global vars
posts      = []
latest     = null
isFetching = false

fetch = ->
	if latest
		process.stdout.write "\nRequesting: #{limit} posts before '#{latest}'.\n"
	else
		process.stdout.write "\nRequesting latest #{limit} posts."
	reddit._get '/new.json',
		limit  : limit
		before : if latest then latest else undefined,
		(error, data)->
			throw error if error?
			data = data.res.body.data
			process.stdout.write "\nGot: #{data.children.length} posts. (#{data.before}-#{data.after})\n"

			return if not data.children.length

			tmp  = []
			tmp.push (
				id    : p.data.name
				title : p.data.subreddit.replace(/[\"\']/g,'´')
				cont  : p.data.title.replace(/[\"\']/g,'´')
				url   : p.data.url
			) for p in data.children

			latest = tmp[0].id
			posts  = posts.concat tmp.reverse()

			if not isFetching
				setInterval fetch, timer * 1000
				setInterval show , 12 * 1000
				isFetching = true


show = ->

	return if not (post = posts.shift())
	command = [
		'growlnotify',
		'-m', "\"#{post.cont}\"",
		"\"#{post.title}\"",
		'--image', './reddit.png',
		'--url' , "\"#{post.url}\""
	]

	Exec command.join(' '), (error, message)->
		if error?
			process.stdout.write message + "\n"
			process.exit 2
		process.stdout.write "Growling: #{JSON.stringify(post)}\n"

# Login and start fetching.

reddit.login auth.user, auth.pass, (error, hash)->
	throw error if error?
	fetch()
