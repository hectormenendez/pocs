$(document).ready(function(){

	var audio = $('#audio').get(0);
	var $image = $('#image div');
	var $count = $('#count');

	var fnDown;
	var toPause;

	// buffer audio
	/*
	audio.volume = 0;
	audio.play();
    setTimeout(function(){
	audio.pause();
	audio.volume = 1;
    }, 5);
*/
	fnDown = function(){
		$image.unbind('mousedown', fnDown);
		//audio.stop();
		audio.play();
		$image.attr('class', 'over');

		toPause = setTimeout(function(){
			$image.attr('class', 'norm');
			$image.bind('mousedown', fnDown);
		}, 500);

		$count.html(parseInt($count.html(),10)+1);

		$.post('/index.php', 'count=true', function(data){
			console.info(data)
		});

		return;

		$.ajax({
			url: 'index.php',
			method: 'post',
			success: function(data) {
				console.info(data);
			}
		});
	}

	// mouse presionado
	$image.bind('mousedown', fnDown);


});