trellum.lib.time = (data=[], $container, id)->
	#return if not data.length

	times = []

	for num, i in data
		text = num.match /(\d+(?:\.5)?)(?:x(\d+))?/
		times.push
			points : parseFloat text[1]
			users  : if text[2] then parseInt(text[2]) else 1
			type   : switch true
				when (num.indexOf('(') isnt -1) then 'log'
				when (num.indexOf('[') isnt -1) then 'est'

	log = est = 0
	times.filter((v,i)-> v.type is 'log').map (v,i)-> log += v.points * v.users
	times.filter((v,i)-> v.type is 'est').map (v,i)-> est += v.points * v.users

	times.total = log:log, est:est

	hasboth = times.total.log and times.total.est
	hasnone = not times.total.log and not times.total.est
	status  = switch true
		when hasnone                                         then 'show'
		when not times.total.log and times.total.est >= 1    then 'warn'
		when not times.total.est and times.total.log >= 1    then 'halt'
		when hasboth and times.total.est  <  times.total.log then 'error'
		when hasboth and times.total.est >=  times.total.log then 'info'
		else 'none'

	div = if hasboth then ' / ' else ''
	txt =
		if hasnone
		then " ? "
		else "#{times.total.log or ''}#{div}#{times.total.est or ''}"

	$sp1 = $('<span/>').addClass('badge-icon icon-sm icon-clock')
	$sp2 = $('<span/>').addClass('badge-text').html(txt)
	$div = $('<div/>')
		.addClass("badge trellum badge-time badge-time-#{status}")
		.append($sp1)
		.append($sp2)
	$container.append $div


trellum.lib.whom = (data, $container, id)->
	$.each data.reverse(), (i, whom)->
		whom = whom.replace(/[\@]/g, '')
		$sp1 = $('<span/>').addClass('badge-icon icon-sm icon-member')
		$sp2 = $('<span/>').addClass('badge-text').html(whom)
		$div = $('<div/>').attr('title', whom)
			.addClass("badge trellum badge-whom badge-whom-#{whom.toLowerCase()}")
			.append($sp1)
			.append($sp2)
		$container.prepend $div

	trellum.trace("lib » whom » #{id}", data) if data.length


trellum.lib.hash = (data, $container, id)->
	$.each data.reverse(), (i, hash)->
		hash = hash.replace(/[\#]/g, '')
		$lbl = $('<label/>').addClass('badge-text').html(hash)
		$div = $('<div/>')
			.addClass("badge trellum badge-hash badge-hash-#{hash.toLowerCase()}")
			.attr('title', hash).append($lbl)
		$container.prepend $div

	trellum.trace("lib » hash » #{id}", data) if data.length
