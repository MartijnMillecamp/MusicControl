// DOM Ready =============================================================
$(document).ready(function() {
	$(document).on('click', "#task2", function(event) {
		//prevent this function to be triggered on click slider
		addRecord('task2', 'click', 0);
		window.location.href = base + '/second?random=' + random;
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
		window.history.pushState('forward', null, './task2');
	}

});