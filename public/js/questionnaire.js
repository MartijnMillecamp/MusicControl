// DOM Ready =============================================================
$(document).ready(function() {
	$('#welcomePostTask').text("Welcome, your ID is: " + userID);
	$(document).on('click', "#postTask", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('postTask', 'click', 0);
		window.location.href = base + '/task2';
	});

	$(".checkbox").change(function() {
		if(this.checked) {
			$('#postTask').css('display','inline-block')
		}
		else{
			$('#postTask').css('display','none')
		}
	});

});