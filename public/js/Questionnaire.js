// DOM Ready =============================================================
$(document).ready(function() {
	$(document).on('click', '#nextInterface', function () {
		addRecord('nextInterface', 'click', 1);
		window.location.href = '/second?random=' + random;
	});
});