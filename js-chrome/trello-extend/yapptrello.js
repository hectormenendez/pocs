hasEvents = false

window.yappTRELLO = {};

yappTRELLO.selectors = {
	close: '.window-overlay, .icon-close',
	open : '.list-card'
}

yappTRELLO.onClose = function(e){
	$(yappTRELLO.selectors.close).unbind('click.onClose');
	yappTRELLO.tweak()
};

yappTRELLO.onOpen = function(e){
	$(yappTRELLO.selectors.close).bind('click.onClose', yappTRELLO.onClose);
};

yappTRELLO.tweak = function(){

	// RegExp
	var rxHash = /\#[^\s]+/g
	var rxWhom = /\@[^\s]+/g

	// jQuery Elements
	var $card  = $('.list-card')

	$('.badge-hash').remove()

	$card.each(function(i){

		var $this   = $(this);
		var $title  = $this.find('.list-card-title');
		var $badges = $this.find('.badges')

		$title.$id  = $title.find('.card-short-id').remove().end();

		this._id   = parseInt($title.$id.text().slice(1),10);
		this._text = $title.clone().children().remove().end().text()
		this._hash = this._text.match(rxHash) || []
		this._whom = this._text.match(rxWhom) || []
		this._text = this._text
			.replace(rxHash,'')
			.replace(rxWhom,'')
			.replace(/\s+/,' ')

		// Remove hashes and whoms from title.
		$title.html(this._text).prepend($title.$id)

		$.each(this._hash.reverse(), function(i, val){
			val = val.replace('#','').toUpperCase()

			var $lbl = $('<label/>')
				.addClass('badge-text badge-hash badge-hash-' + val.toLowerCase())
				.html(val)

			var $div = $('<div/>')
				.addClass('badge')
				.attr('title', val)
				.append($lbl)

			$badges.prepend($div)
		});
	});

	yappTRELLO.hasRun = true;
};
