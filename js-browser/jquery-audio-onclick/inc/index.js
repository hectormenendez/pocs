$(document).ready(function(){

	var audio = $('#audio').get(0);
	var $image = $('#image div');
	var $count = $('#count');

	var fnDown = function(){
		$image.unbind('mousedown', fnDown);
		//audio.stop();
		audio.play();
		$image.attr('class', 'over');

		toPause = setTimeout(function(){
			$image.attr('class', 'norm');
			$image.bind('mousedown', fnDown);
		}, 800);

		$count.html(parseInt($count.html(),10)+1);
	}

	// mouse presionado
	$image.bind('mousedown', fnDown);


});