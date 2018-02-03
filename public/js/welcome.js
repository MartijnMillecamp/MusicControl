
$( document ).ready(function() {

	$(document).on('click', '#firstInterface', function () {
		addRecord('firstInterface', 'click', 1);
		if (document.getElementById("myCheck1").checked &&
			document.getElementById("myCheck2").checked &&
			document.getElementById("myCheck3").checked &&
			document.getElementById("myCheck5").checked &&
			document.getElementById("myCheck6").checked) {
			//Check email and continue
			window.location.href = base + '/auth/spotify';
		} else {
			alert('Please check all required checkboxes to indicate that you agree to take part in this study');
		}

	});
});