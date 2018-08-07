$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSd3EKn3qpm2YU0GGtzO_b6-tdkMbjk0Voz-_T0ogXqcmx-7aA/viewform?usp=pp_url&entry.452024117=";
	src += userID  + '&hl=en';
	document.getElementById('iframePostTask').src = src;

	$('#button_postTaskQuestionnaires').click(function (event) {
		window.location.href = base + '/pilotStudy';
	});
});


var count = 0;
function loadPostTask() {
	count++
	if(count===2){
		$('#button_postTaskQuestionnaires').css('display', 'flex')
	}
}