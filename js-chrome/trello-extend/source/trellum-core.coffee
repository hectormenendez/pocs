window.trellum = {}

trellum.config = debug:false, exclude:[]
trellum.lib    = {}

trellum.log = ->
	return null unless trellum.config.debug
	args = Array::slice.call(arguments)
	args.unshift 'trellum »'
	console.log.apply console, args


trellum.onchange = -> null
trellum.card     = -> null

trellum.title = ($card, replacements=[])->
	$title  = $card.find  '.list-card-title'
	$short  = $title.find '.card-short-id'

	# Replace the visible title with the trellumed one.
	text = (title = $card.data 'trellum-title')
	text = text.replace(replacement, '') for replacement in replacements
	text = text.replace(/\s+/, ' ')

	$title.html(text).prepend($short)
	return title

trellum.watch = ->

	triggers = []
	timeout  = null

	observer = new window.MutationObserver (mutations)->
		$.each mutations, (i, mutation)->
			$(mutation.target).each ->
				$target = $ this
				classes = $target.attr 'class'
				return unless classes

				classes = classes.split(' ').filter (x)->
					x.indexOf('js-') is 0 and trellum.config.exclude.indexOf(x) is -1

				return unless classes.length
				clearTimeout timeout if timeout
				timeout = setTimeout trellum.onupdate, 500, $target, classes

	observer.observe document.body,
		childList     : true
		characterData : true
		attributes    : false
		subtree       : true

	trellum.onupdate()


trellum.onupdate = ($e=false, triggers=[])->
	trellum.log 'onupdate » triggers »', triggers

	# if called manually apply to every card on the board

	if not $e or triggers.indexOf('js-board-list') isnt -1
		$cards = $('#board .list-card')
	else if triggers.indexOf('js-num-cards') isnt -1
		$cards = $e.parentsUntil('.list').parent().find('.list-card')
	else
		$cards = $e.closest('.list-card', '.list-card').add $e.find('.list-card')

	# Is the editor running?
	$overlay = $('.window-overlay')

	$cards.each (i, card)->
		$card  = $ card
		isEdit = triggers.indexOf('js-card-name') isnt -1 and $overlay.is ':visible'

		if $card.data('trellum')
			$card.removeData 'trellum'
			trellum.log "#{$card.data 'trellum-id'} » Prevented recursion."
			return true

		$card.find('.trellum').remove()

		$title = $card.find('.list-card-title')
		$short = $title.find('.card-short-id')

		# Obtain card ID, and store it.
		$card.data 'trellum-id', $short.text().replace('#','').trim()

		if isEdit or not $card.data 'trellum-title'
			$card.data 'trellum-title', $title.clone().children().remove().end().text()

		trellum.card.apply this,[$card]

		$card.data 'trellum', true

	trellum.onchange.apply this, [$e, $cards, triggers]
