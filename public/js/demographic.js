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
		window.history.pushState('forward', null, './demographic');
	}
});