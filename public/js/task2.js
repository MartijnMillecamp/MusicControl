// DOM Ready =============================================================
$(document).ready(function() {
	$(document).on('click', "#task2", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('task2', 'click', 0);
		window.location.href = base + '/second?random=' + random;
	});

});