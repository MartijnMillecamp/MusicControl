$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSfo3zYh6TPwjx8Vw7QKTjCYDPWWkOqqiOKToE4JXy0uKmvhYA/viewform?usp=pp_url&entry.452024117=test";
	src += userID  + '&hl=en';
	document.getElementById('iframePostTask').src = src;

	$('#button_postTaskQuestionnaires').click(function (event) {
		window.location.href = getNextLocationPostTask();
	});
});


var count = 0;
function loadPostTask() {
	count++
	if(count===2){
		$('#button_postTaskQuestionnaires').css('display', 'flex')
	}
}