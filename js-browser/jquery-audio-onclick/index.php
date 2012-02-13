<?php

// connect to database and fetch current count of clicks
if (!$db_connect = mysql_connect('localhost', 'pinyapre_main', 'pinya26'))
    die('Error: ' . mysql_error());
mysql_select_db('pinyapre_main') OR die('Cannot select database.');
if (!$qry = mysql_query("SELECT count FROM main")) die(mysql_error());
$count = mysql_fetch_row($qry);
$count = (int)$count[0];

// catch click from javascript
if (isset($_POST['count'])){
	$qry =  mysql_query("UPDATE main SET count=".($count+1));
	die(var_dump(mysql_affected_rows()));
}
?>
<!DOCTYPE HTML>
<!--[if IE 6]><![endif]-->
<!--[if lt IE 7 ]>             <html class="no-js ie ie6 ie-lt8" lang="es-mx"><![endif]-->
<!--[if IE 7 ]>                <html class="no-js ie ie7 ie-lt8" lang="es-mx"><![endif]-->
<!--[if IE 8 ]>                <html class="no-js ie ie8"        lang="es-mx"><![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html class="no-js" lang="es-mx">          <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Y Alejandra Piña presume… ¡Así!</title>
	<!--[if lt IE 9]>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/ie7-squish.js" type="text/javascript"></script>
	<![endif]-->
	<link rel="stylesheet" href="inc/index.css" type="text/css" media="screen">
	<link rel="shortcut icon" href='favicon.ico'>
</head>
<body>
<!-- BODY -->
<audio id="audio">
	<source src="/inc/claroqueno.ogg" type="audio/ogg" />
	<source src="/inc/claroqueno.mp3" type="audio/mpeg" />
	Tu navegador no soporta audio HTML5.
</audio>

<div id="image">

	<div class="norm"></div>

</div>

<div id="count"><?=$count?></div>

<!-- BODY -->
<script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'></script>
<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-29087318-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s  = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>
<script type="text/javascript" src='/inc/index.js'></script>

</body>
</html>
<?php mysql_close($db_connect); ?>