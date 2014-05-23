trellum.config.debug   = false
trellum.config.trace   = false

trellum.config.include = []
trellum.config.exclude = [
	'js-hide-on-sending'
	'js-sidebar-list-actions'
	'js-phrase'
	'js-list-header'
	'js-back-view'
	'js-checklist-list'
	'js-card-title',
]

trellum.config.match =
	global : ['js-board-list', 'js-board-header']
	single : ['js-card-members', 'js-card-labels']
	list   : ['js-list-cards', 'js-num-cards']
	edit   : ['js-card-name']
	over   : ['js-member-droppable']



trellum.afterupdate = ($element, $cards, trigger)->
	return true

trellum.card = ($card)->

	$badge  = $card.find  '.badges'

	id     = $card.data 'trellum-id'
	rxHash = /()\#[\-A-Za-z0-9]+/g
	rxWhom = /\@[\-A-Za-z0-9]+/g
	rxTime = /[\[\(]((?:[1-9][0-9]*|0\.5)(?:x[1-9][0-9]*)?)[\]\)]/g

	title  = trellum.title $card, [rxWhom, rxHash, rxTime]

	trellum.lib.whom(title.match(rxWhom) or [], $badge, id)
	trellum.lib.hash(title.match(rxHash) or [], $badge, id)
	trellum.lib.time(title.match(rxTime) or [], $badge, id)

$(document).ready ->
	trellum.log 'Ready.'
	trellum.watch()
