
$( document ).ready(function() {

	$(document).on('click', '#firstInterface', function () {
		var loc = window.location.pathname;

		console.log(loc)
		addRecord('firstInterface', 'click', 1);
		window.location.href = '/spotify/first';
	});
});