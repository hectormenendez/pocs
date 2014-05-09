hasEvents = false

window.yappTRELLO = {};

yappTRELLO.debug  = false;

yappTRELLO.exclusions = [
	'js-card-name',
	'js-hide-on-sending',
	'js-sidebar-list-actions',
	'js-phrase'
];

yappTRELLO.selectors = {
	close  : '.js-save-edit',
	open   : '.list-card',
	click  : '.js-open-board',
	action : '.js-list-cards, .js-save-edit'
};

yappTRELLO.log = function(){
	if (!yappTRELLO.debug) return null;
	args = Array.prototype.slice.call(arguments);
	args.unshift('yappTRELLO');
	return console.log.apply(console, args);
};

yappTRELLO.onClose = function(e){
	yappTRELLO.log('onClose()');
	$(yappTRELLO.selectors.close).unbind('click.onClose');
	yappTRELLO.tweak()
};

yappTRELLO.onOpen = function(e){
	yappTRELLO.log('onOpen()');
	$(yappTRELLO.selectors.close).bind('click.onClose', yappTRELLO.onClose);
};

yappTRELLO.onClick =function(e){
	yappTRELLO.log('onClick()');
	yappTRELLO.tweak()
}

yappTRELLO.tweak = function(){
	yappTRELLO.log('tweak()');

	// RegExp
	var rxHash = /\#[^\s]+/g
	var rxWhom = /\@[^\s\.]+/g

	// jQuery Elements
	var $card  = $('.list-card')

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

		$title.html(this._text).prepend($title.$id)

		// enable users
		$.each(this._whom, function(i, val){
			val = val.replace(/[\@]/g,'');
			cls = 'badge-whom-' + val.toLowerCase();
			$el = $(cls);

			var $spn1 = $('<span/>')
				.addClass('badge-icon icon-sm icon-member');

			var $spn2 = $('<span/>')
				.addClass('badge-text')
				.html(val);

			var $div = $('<div/>')
				.attr('title', val)
				.addClass('badge badge-whom ' + cls)
				.append($spn1)
				.append($spn2);

			if (!$el.length) $badges.prepend($div);
			else $el.replaceWith($div);
		});

		// enable hashtags
		$.each(this._hash.reverse(), function(i, val){
			val = val.replace(/[\#]/g,'');
			cls = 'badge-hash-' + val.toLowerCase();
			$el = $(cls);

			var $lbl = $('<label/>')
				.addClass('badge-text')
				.html(val);

			var $div = $('<div/>')
				.addClass('badge badge-hash ' + cls)
				.attr('title', val)
				.append($lbl);

			if (!$el.length) $badges.prepend($div);
			else $el.replaceWith($div);
		});

	});

	yappTRELLO.hasRun = true;
};
