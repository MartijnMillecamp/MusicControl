var base = '';
$( document ).ready(function() {
	$('#button_welcome').click(function (event) {
		window.location.href = base + '/questionnaires';
	});
	$('#button_disagree').click(function (event) {
		window.location.href =  base + '/thanks';
	});
});

