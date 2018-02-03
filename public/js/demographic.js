// DOM Ready =============================================================
$(document).ready(function() {
	$('#welcomeDemographic').text("Welcome, your ID is: " + userID);
	$(document).on('click', "#demographic", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('demographic', 'click', 0);
		window.location.href = base + '/task1';
	});

});