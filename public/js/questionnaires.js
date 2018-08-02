$( document ).ready(function() {
	// https://docs.google.com/forms/d/e/1FAIpQLSd-bO5IL4Kt6TdFvCrJAgg26t7xAJHW48WI8oDH-lnyYR6Snw/viewform?usp=pp_url&entry.452024117=test
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSd-bO5IL4Kt6TdFvCrJAgg26t7xAJHW48WI8oDH-lnyYR6Snw/viewform?usp=pp_url&entry.452024117=";
	src += userID ;
	var backup = "https://goo.gl/forms/8uCLRa92uRMHUiCi1?embedded=true&amp;hl=en"
	document.getElementById('iframePC').src = src

	$('#button_questionnaires').click(function (event) {
		var height = window.screen.availHeight;
		var width = window.screen.availWidth;
		var resolution = height + 'x' + width;
		var queryUser = 'userName=' + userName + '&userId=' + userID;
		var queryAdmin = '&userNumber=' + userNumber + '&screenSize=' + resolution;
		var query = base + '/addUser?' + queryUser + queryAdmin;

		$.getJSON( query, function( message ) {
			window.location.href = base + '/attributes';
		});
	});
});