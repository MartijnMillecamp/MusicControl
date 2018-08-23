
$( document ).ready(function() {
	$('#button_welcome').click(function (event) {
		addInteraction('button_welcome', 'click', 'click');
		window.location.href = base + '/auth/spotify';
	});
	$('#button_disagree').click(function (event) {
		window.location.href = base + '/thanks';
	});
});

