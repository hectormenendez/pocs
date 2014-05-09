//document.addEventListener('DOMContentLoaded', yappTRELLO.tweak);


yappTRELLO.debug = true;

$(document).ready(function(){

	yappTRELLO.log('» init');

	var classes = []
	$('*').each(function(){
	   names = $(this).attr('class');
	   if (!names) return;
	   names = names.split(' ').filter(function(x){ return x.indexOf('js-') !== -1 });
	   if (!names.length) return;
	   names.map(function(x){
			if(
				classes.indexOf(x) === -1 &&
				yappTRELLO.exclusions.indexOf(x) === -1
			) classes.push(x)
	   });
	});
	yappTRELLO.log('» Classes:', classes);

	//$(yappTRELLO.selectors.open).bind('click.open', yappTRELLO.onOpen);
	//$(yappTRELLO.selectors.click).bind('click.click', yappTRELLO.onClick);

	yappTRELLO.tweak()

	var to = null;

	observer = new window.MutationObserver(function(mutations){
		$.each(mutations, function(i, mutation){ $(mutation.target).each(function(){

			$target  = $(this);

			//hasClass = yappTRELLO.selectors.action.split(',')
			hasClass = classes.filter(function(x){
				x = x.replace('.','').trim();
				return x.length && $target.hasClass(x);
			});

			if (!hasClass.length) return;

			yappTRELLO.log('» triggered:', hasClass[0])

			if (to) clearTimeout(to);
			to = setTimeout(yappTRELLO.tweak, 500);

		}); });
	});

	observer.observe(document.body, {
		childList     : true,
		characterData : true,
		attributes    : false,
		subtree       : true
	});

});
