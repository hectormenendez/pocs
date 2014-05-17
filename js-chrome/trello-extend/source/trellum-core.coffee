window.trellum = {}

trellum.config =
	debug   : false
	trace   : false
	exclude : []
	include : []
	delay   : []
	match   : {}

trellum.lib    = {}

trellum.util =

	diff: (arr1=[], arr2=[])->
		arr = []
		(arr.push value if arr2.indexOf(value) isnt -1) for value,i in arr1
		return arr

	iseq: (arr1=[], arr2=[])->
		JSON.stringify(arr1) is JSON.stringify(arr2)

trellum.onchange = -> null
trellum.card     = -> null

trellum.log = ->
	return null unless trellum.config.debug
	args = Array::slice.call(arguments)
	args.unshift 'trellum »'
	console.log.apply console, args

trellum.trace = ->
	return null unless trellum.config.trace
	args = Array::slice.call(arguments)
	args.unshift 'trellum »'
	console.log.apply console, args


trellum.title = ($card, replacements=[])->
	$title  = $card.find  '.list-card-title'
	$short  = $title.find('.card-short-id').addClass('trellum-touched')

	# Replace the visible title with the trellumed one.
	text = (title = $card.data('trellum-title') or 'missing-data')
	text = text.replace(replacement, '') for replacement in replacements
	text = text.replace(/\s+/, ' ')
	$title.html(text).prepend $short
	return title

trellum.watch = ->

	observer = new window.MutationObserver (mutations)-> $.each mutations, (i, mutation)->
		target   = mutation.target
		$target  = $(target)
		classes  = $target.attr 'class'
		triggers = []
		return unless classes

		# a mutation that has a class defined
		classes  = classes.split ' '
		triggers = classes.filter (x)->
			trellum.config.include.indexOf(x) isnt -1 or
			(x.indexOf('js-') is 0 and  trellum.config.exclude.indexOf(x) is -1)

		return trellum.trace('Ignore »', classes) unless triggers.length

		# a mutation that has a "js-" class defined
		delete mutation[attribute] for attribute in [
			'target'
			'nextSibling'
			'previousSibling'
			'attributeNamespace'
		]

		if target._timeout
			trellum.trace 'Delay » abort »', triggers, mutation.type
			clearTimeout(target._timeout)
			delete target._timeout

		trellum.trace 'Delay » setup »', triggers, mutation.type
		target._timeout = setTimeout (->
			trellum.trace 'Delay » start »', triggers, mutation.type, target
			trellum.onupdate $target, triggers, mutation
			delete target._timeout
		), 444


	observer.observe document.body,
		characterData    : true  # Monitor data changes
		characterOldData : false  # Record old data
		attributes       : true  # Monitor attribute changes
		childList        : true  # Monitor mutations to target's children.
		subtree          : true  # Monitor not just target, but also target's descendants.

	trellum.onupdate()


trellum.onupdate = ($e=false, triggers=[], mutation={})->

	match    = trellum.config.match
	isAtt    = mutation.type is 'attributes'
	$overlay = $('.window-overlay')

	# save the last card that was active.
	if $e and isAtt and not trellum.util.diff(triggers, match.over).length
		return false
	else if $e and isAtt
		$card = $e.closest('.list-card')
		return false if not $card.length or $overlay.is(':visible')

		isA = $e.hasClass('active-card')
		txt = $card.find('.list-card-title').text()
		trellum.trace 'onupdate » isactive »', isA, '»', txt

		return if isA
		then $card.addClass('trellum-active')
		else $card.removeClass('trellum-active')

	# Detect if there's a modification done bt trellum title.
	hasAdded = mutation.addedNodes and mutation.addedNodes.length
	if hasAdded and ($node=$(mutation.addedNodes[0])) and $node.hasClass('trellum-touched')
		$node.removeClass 'trellum-touched'
		trellum.log "onupdate » anti-recursion » #{$node.text().replace('#','')}"
		return false

	trellum.log 'onupdate » triggers:', triggers, 'mutation:', mutation

	# Decide what cards to select based upon triggers.
	if not $e or trellum.util.diff(triggers, match.global).length
		$cards = $('#board .list-card')
		trellum.log "onupdate » mode » global (#{$cards.length})", $cards

	else if trellum.util.diff(triggers, match.single).length
		$cards = $e.closest('.list-card')
		trellum.log "onupdate » mode » single (#{$cards.length})", $cards

	else if trellum.util.diff(triggers, match.list).length
		$cards  = $e.parentsUntil('.list-area-wrapper', '.list').find('.list-card')
		trellum.log "onupdate » mode » list (#{$cards.length})", $cards

	else if $overlay.is(':visible') and trellum.util.diff(triggers, match.edit)
		$cards = $('.trellum-active')
		trellum.log "onupdate » mode » edit (#{$cards.length})", $cards

	else
		$cards = $e.closest('.list', '.list').find('.list-card')
		trellum.log "onupdate » mode » else (#{$cards.length})", $cards

	# Iterate cards and 'set the table' for modifications.
	$cards.each (i, card)->
		$card  = $(card)
		$title = $card.find  '.list-card-title'
		$short = $title.find '.card-short-id'
		text   = $title.clone().children().remove().end().text()

		$card.find('.trellum').remove()

		# In edit mode
		if not trellum.util.diff(triggers, match.edit).length
			# store/update the original title accordingly
			$card.data('trellum-orig', text) if not $card.data('trellum-orig')
			text = $card.data 'trellum-orig'

		$card.data 'trellum-id'   , $short.text().replace('#','').trim()
		$card.data 'trellum-title', text

		$card.removeClass('trellum-active')

		trellum.card.apply this,[$card]


	trellum.log 'afterupdate »', triggers, "\n\n"
	trellum.afterupdate.apply this, [$e, $cards, triggers]
