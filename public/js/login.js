$( document ).ready(function() {
	$( "#credentials" ).dialog({
		autoOpen: false,
		width:800,
		height: 300
	});
	$('#button_login').click(function (event) {
		window.location.href = base + '/auth/spotify';
	});
	$('#button_noLogin').click(function (event) {
		$( "#credentials" ).dialog("open");
		$('div#credentials').on('dialogclose', function(event) {
			window.location.href = base + '/auth/spotify';
		});

	});
});