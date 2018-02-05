var counter = 0;

// DOM Ready =============================================================
$(document).ready(function() {
	$(window).on("beforeunload", function() {
		if (!checkSave()) {
			return "You have unsaved changes.";
		}
	});
	$('#welcomeDemographic').text("Welcome, your ID is: " + userID);
	$(document).on('click', "#demographic", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('demographic', 'click', 0);
		window.location.href = base + '/task1';
	});

	$(".checkbox").change(function() {
		if(this.checked) {
			$('#demographic').css('display','inline-block')
		}
		else{
			$('#demographic').css('display','none')
		}
	});
});