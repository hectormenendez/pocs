//document.addEventListener('DOMContentLoaded', yappTRELLO.tweak);

$(function(){

	$(yappTRELLO.selectors.open).bind('click.open', yappTRELLO.onOpen);


	yappTRELLO.tweak()


	return true
	$('.js-toggle-label-filter, .js-select-member, .js-due-filter, .js-clear-all, js-save-edit').bind('click', onReady);
	$('.js-input').bind('keyup', onReady);
	$('.js-share').bind('click',function(){ setTimeout(onReady,500); });

});
