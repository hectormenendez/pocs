window.trellum = {}

trellum.config = debug:false, exclude:[]
trellum.lib    = {}

trellum.log = ->
	return null unless trellum.config.debug
	args = Array::slice.call(arguments)
	args.unshift 'trellum »'
	console.log.apply console, args


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

	$('body *').each ->
		return unless (names = $(this).attr 'class')
		names = names.split(' ').filter (x) -> x.indexOf('js-') isnt -1
		return unless names.length
		names.map (x)->
			if triggers.indexOf(x) is -1 and trellum.config.exclude.indexOf(x) is -1
				triggers.push(x)

	trellum.log 'triggers', triggers

	observer = new window.MutationObserver (mutations)->
		$.each mutations, (i, mutation)->
			$(mutation.target).each ->
				$target = $ this
				trigger = triggers.filter (x)->
					x = x.replace('.', '').trim()
					return x.length and $target.hasClass x

				return unless trigger.length
				clearTimeout timeout if timeout
				timeout = setTimeout trellum.onUpdate, 500, $target, trigger[0]

	observer.observe document.body,
		childList     : true
		characterData : true
		attributes    : false
		subtree       : true

	trellum.onUpdate()


trellum.onUpdate = ($e=false, trigger=false)->
	trellum.log 'onUpdate' + (if trigger then "» trigger: #{trigger}" else '.')

	# if called manually apply to every card on the board

	if not $e
		$cards = $('#board .list-card')
	else if trigger is 'js-num-cards'
		$cards = $e.parentsUntil('.list').parent().find('.list-card')
	else
		$cards = $e.closest('.list-card', '.list-card').add $e.find('.list-card')

	# Is the editor running?
	$overlay = $('.window-overlay')

	$cards.each (i, card)->
		$card  = $ card
		isEdit = trigger is 'js-card-name' and $overlay.is ':visible'

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

		trellum.onTweak.apply this,[$card]

		$card.data 'trellum', true
