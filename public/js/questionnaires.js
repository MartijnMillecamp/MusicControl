$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSd-bO5IL4Kt6TdFvCrJAgg26t7xAJHW48WI8oDH-lnyYR6Snw/viewform?usp=pp_url&entry.452024117=";
	src += userID ;
	src+= "&entry.1922223969=localhost:3002/_03_BC/index.html?q%3D" + userID;

	document.getElementById('iframePC').src = src;

	$('#button_questionnaires').click(function (event) {
		addInteraction('button_questionnaires', 'click', 'click');

		var height = window.screen.availHeight;
		var width = window.screen.availWidth;
		var resolution = height + 'x' + width;
		var queryUser = 'userName=' + userName + '&userId=' + userID;
		var queryAdmin = '&userNumber=' + userNumber + '&screenSize=' + resolution;
		var query = base + '/addUser?' + queryUser + queryAdmin;
		$.getJSON( query, function( message ) {
			console.log(message);
			window.location.href = base + '/demo?userId=' + userID;
		});
	});
});

var count = 0
function load() {
	count++;
	if(count===5){
		$('#button_questionnaires').css('display', 'flex')
	}
}