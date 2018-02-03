// DOM Ready =============================================================
$(document).ready(function() {
	$('#welcome').text("Welcome " + userName);
	$(document).on('click', "#overview", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('overview', 'click', 0);
		window.location.href = base + '/demographic';
	});

});