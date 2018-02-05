
$( document ).ready(function() {
	$(document).on('click', '#firstInterface', function () {
		var valid = true;
		if(document.getElementById("myCheck4").checked){
			var email = document.getElementById("myEmailArea").value;
			if (email === ''){
				valid=false;
			}
			else{
				addEmail(email)
			}
		}
		if (document.getElementById("myCheck1").checked &&
			document.getElementById("myCheck2").checked &&
			document.getElementById("myCheck3").checked &&
			document.getElementById("myCheck5").checked &&
			document.getElementById("myCheck6").checked && valid) {
			//Check email and continue
			window.location.href = base + '/auth/spotify';
		} else {
			if(!valid){
				alert('Please check your email address');
			}
			else{
				alert('Please check all required checkboxes to indicate that you agree to take part in this study');
			}
		}

	});

});

function addEmail(email) {
	var query = base + '/addEmail?email=' + email;
	$.getJSON(query, function (data) {
		// console.log(data)
	})
}