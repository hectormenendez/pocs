

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
