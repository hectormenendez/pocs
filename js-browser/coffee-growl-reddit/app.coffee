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
timer  = 60 * 5  # seconds

# Global vars
posts      = []
latest     = null
isFetching = false

fetch = ->
	console.info "Requesting: #{limit} posts after '#{latest}'."
	reddit._get '/new.json',
		limit  : limit
		before : if latest then latest else undefined,
		(error, data)->
			throw error if error?
			data = data.res.body.data
			console.info "Got: #{data.children.length} posts. (#{data.before}-#{data.after})"

			if data.children.length
				tmp  = []
				tmp.push (
					id    : p.data.name
					title : p.data.title
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
		'-m', "\"#{post.title}\"",
		'--image', './reddit.png'
		'--url' , "\"#{post.url}\""
	]
	Exec command.join(' '), (error, message)->
		if error?
			process.stdout.write message + "\n"
			process.exit 2
		process.stdout.write "#{JSON.stringify(post)}"

# Login and start fetching.

reddit.login auth.user, auth.pass, (error, hash)->
	throw error if error?
	fetch()
