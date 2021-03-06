# Node libs
Exec = require('child_process').exec
HTTP = require 'http'
# NPM libs
Reddit = require 'reddit-api'

auth = require './auth'

# Setup reddit
reddit = new Reddit 'gReddit v0.1 by /u/hamr23'
reddit.setIsLogging     false
reddit.setDispatchMode 'limited'

# Configuration
limit  = 10
timer  = 120  # seconds

# Global vars
seen       = []
posts      = []
latest     = null
isFetching = false

Number::fill = -> "0#{this}".slice(-2)

timestamp = ->
	date = new Date()
	fill = (val)-> "0#{val}".slice -2
	return [
		[date.getFullYear(),(date.getMonth()+1).fill(), date.getDate().fill()].join('-')
		[date.getHours().fill(), date.getMinutes().fill(),date.getSeconds().fill()].join(':')
	].join ' '

fetch = ->
	if latest
		process.stdout.write "\n#{timestamp()} [REQ] #{limit} posts before '#{latest}'."
	else
		process.stdout.write "\n#{timestamp()} [REQ] Latest #{limit} posts."
	reddit._get '/new.json',
		limit  : limit
		before : if latest then latest else undefined,
		after  : null
		(error, data)->
			throw error if error?
			data = data.res.body.data
			process.stdout.write "\n#{timestamp()} [RES] #{data.children.length} posts. [#{data.after} - #{data.before}]"

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
		process.stdout.write "\n#{timestamp()} [PUT] #{JSON.stringify(post)}"
		seen.unshift post
		# just keep the latest 100 posts
		seen.slice 0,limit

# Login and start fetching.
reddit.login auth.user, auth.pass, (error, hash)->
	throw error if error?
	fetch()

# Initialize web server
server = HTTP.createServer (request, response)->
	response.writeHead 200, "Content-Type": "text/html"
	html = "<html><head><title>gReddit</title></head><body><ul>"
	for post in seen
		html += "<li>#{post.title} <a href='#{post.url}'>#{post.cont}</a></li>"
	html += "</ul></body></html>"
	response.end html

server.listen(9999)
process.stdout.write "\nServer running on localhost:9999\n"
