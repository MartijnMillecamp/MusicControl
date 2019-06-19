
$( document ).ready(function() {

	$('#button_task').click(function () {
		addInteraction('button_task', 'click', 'click');
		window.location.href = base + '/exploration?userId=' + userId;
	});
});



