// DOM Ready =============================================================
$(document).ready(function() {
	$('#welcomePostTask').text("Welcome, your ID is: " + userID);
	$(document).on('click', "#postTask", function(event) {
		//prevent this function to be triggered on click slider
		addInteraction('postTask', 'click', 0);
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

	//Prevent going back
	if (window.history && window.history.pushState) {
		$(window).on('popstate', function() {
			var hashLocation = location.hash;
			var hashSplit = hashLocation.split("#!/");
			var hashName = hashSplit[1];
			if (hashName !== '') {
				var hash = window.location.hash;
				if (hash === '') {
					alert('Warning, please do not go back!');
				}
			}
		});
		window.history.pushState('forward', null, './questionnaire');
	}

});