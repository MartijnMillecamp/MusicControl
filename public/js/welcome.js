
$( document ).ready(function() {

	$(document).on('click', '#firstInterface', function () {
		addRecord('firstInterface', 'click', 1);
		window.location.href = '/first';
	});
});