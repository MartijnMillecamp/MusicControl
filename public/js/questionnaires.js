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
    var interfaceValues = getInterfaceValues(userId);
    var taskValues = getTaskValues(userId)
    var queryInterface = '&playable=' + interfaceValues[0] + '&baseline=' + interfaceValues[1] + '&unplayable=' + interfaceValues[2];
    var queryTask = '&relaxing=' + taskValues[0] + '&fun=' + taskValues[1] + '&sport=' + taskValues[2] + '&current=1' ;
    
    var query = queryBase + queryAdmin + queryInterface + queryTask;
    $.getJSON( query, function( message ) {
			window.location.href = base + '/calibration';
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

function getInterfaceValues(userId) {
	var userCounter = userId % 1000;
	var mod6 = userCounter % 6;
	
  if (mod6 === 1){
    return [1,2,3]
  }
  else if (mod6 === 2){
    return [1,3,2]
  }
  else if (mod6 === 3){
    return [2,1,3]
  }
  else if (mod6 === 4){
    return [2,3,1]
  }
  else if (mod6 === 5){
    return [3,1,2]
  }
  else{
  	return [3,2,1]
  }
}

function getTaskValues(userId) {
  var userCounter = userId % 1000
	var mod36 = userCounter % 36;
	if (mod36 < 6){
		return [1,2,3]
	}
	else if (mod36 > 5 && mod36 < 12){
		return [1,3,2]
	}
  else if (mod36 > 11 && mod36 < 18){
    return [2,1,3]
  }
  else if (mod36 > 17 && mod36 < 24){
    return [2,3,1]
  }
  else if (mod36 > 23 && mod36 < 30){
    return [3,1,2]
  }
  else{
  	return [3,2,1]
	}
	

}