
$( document ).ready(function() {

	$(document).on('click', '#firstInterface', function () {
		addRecord(userID, 'firstInterface', 'click', 1);
		window.location.href = '/first';
	});
});