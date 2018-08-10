$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSd3EKn3qpm2YU0GGtzO_b6-tdkMbjk0Voz-_T0ogXqcmx-7aA/viewform?usp=pp_url&entry.452024117=";
	src += userID  + '&hl=en';
	document.getElementById('iframePostTaskExpl').src = src;

	$('#button_postTaskQuestionnairesExpl').click(function (event) {
		window.location.href = getNextLocationPostTask();
	});
});


var count = 0;
function loadPostTask() {
	count++;
	if(count===2){
		$('#button_postTaskQuestionnairesExpl').css('display', 'flex')
	}
}