// Thanks to https://alicekeeler.com/2018/03/19/google-forms-pre-fill-answer/

var interface = $.cookie('interfaceDev');

$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSeiXRNy9KkqS_y-c3wwol6cZHspYYHvUNh75QuoiGZ_YT_V4w/viewform?usp=pp_url&entry.452024117=";
	src += userID ;


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
			// window.location.href = base + '/demo?userId=' + userID;
			window.location.href = base + '/attributes';

		});
	});
});

var count = 0
function load() {
	count++;
	if(count===2){
		$('#button_questionnaires').css('display', 'flex')
	}
}