trellum.config.debug   = true
trellum.config.exclude = ['js-hide-on-sending','js-sidebar-list-actions','js-phrase']


trellum.onTweak = ($card)->

	$badge  = $card.find  '.badges'

	rxHash = /\#[\-A-Za-z0-9]+/g
	rxWhom = /\@[\-A-Za-z0-9]+/g

	title = trellum.title $card, [rxWhom, rxHash]

	trellum.lib.whom(title.match(rxWhom) or [], $badge)
	trellum.lib.hash(title.match(rxHash) or [], $badge)


$(document).ready ->
	trellum.log 'Ready.'

	trellum.watch()
