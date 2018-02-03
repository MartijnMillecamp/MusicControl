// DOM Ready =============================================================
$(document).ready(function() {
	$(document).on('click', "#task1", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('task1', 'click', 0);
		window.location.href = base + '/first';
	});

});