

$( document ).ready(function() {
	$('#button_expl').click(function (event) {
		window.location.href = base+'/home?userId=' + $.cookie('userId') + "&interface=expl";
	});

	$('#button_base').click(function (event) {
		window.location.href = base+'/home?userId=' + $.cookie('userId') + "&interface=base";
	});



});
