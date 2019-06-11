// Thanks to https://alicekeeler.com/2018/03/19/google-forms-pre-fill-answer/

var interface = $.cookie('interfaceDev');

$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSeiXRNy9KkqS_y-c3wwol6cZHspYYHvUNh75QuoiGZ_YT_V4w/viewform?usp=pp_url&entry.452024117=";
	src += userId ;


	document.getElementById('iframePC').src = src;

	$('#button_questionnaires').click(function (event) {
		addInteraction("submitQuestionnaire", "click", -1);
		var height = window.screen.availHeight;
		var width = window.screen.availWidth;
		var resolution = height + 'x' + width;
		var queryBase = base + '/addUser?';
    var queryAdmin = '&userId=' + userId + '&screenSize=' + resolution;
    var values = getValues(userId);
    var queryInterface = '&playable=' + values[0] + '&baseline=' + values[1] ;
    var queryTask = '&relaxing=' + values[2] + '&fun=' + values[3] + '&current=' + values[4] ;
    
    var query = queryBase + queryAdmin + queryInterface + queryTask
    $.getJSON( query, function( message ) {
			window.location.href = base + '/attributes';
		});
	});
});

var count = 0;
function load() {
	count++;
	if(count===2){
		$('#button_questionnaires').css('display', 'flex')
	}
}

function getValues(userId) {
	var mod4 = userId % 4;
	
	if (mod4 === 1){
		return [1,2,1,2,1]
	}
	else if (mod4 === 2){
		return [1,2,2,1,1]
	}
	else if (mod4 === 3){
		return [2,1,1,2,1]
	}
	else{
		return [2,1,2,1,1]
	}
	
}