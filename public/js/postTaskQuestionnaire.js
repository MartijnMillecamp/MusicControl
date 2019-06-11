$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSfo3zYh6TPwjx8Vw7QKTjCYDPWWkOqqiOKToE4JXy0uKmvhYA/viewform?usp=pp_url&entry.452024117=";
	src += userId  + '&hl=en';
	document.getElementById('iframePostTask').src = src;

	$('#button_postTaskQuestionnaires').click(function (event) {
		addInteraction('button_postTaskQuestionnaires', 'click', 'click');

		window.location.href = getNextLocationPostTask();
	});
});


var countPT = 0;
function loadPostTask() {
	countPT++
	if(countPT===1){
		$('#button_postTaskQuestionnaires').css('display', 'flex')
	}
}