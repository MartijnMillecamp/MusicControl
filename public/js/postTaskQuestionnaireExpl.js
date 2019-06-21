$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSehT9ThQdCJ0bTF0e109GPGejQhI9YOXYowJDj0XqHSBxNjZA/viewform?usp=pp_url&entry.452024117=";
	src += userId  + '&hl=en';
	document.getElementById('iframePostTaskExpl').src = src;

	$('#button_postTaskQuestionnairesExpl').click(function (event) {
		addInteraction('button_postTaskQuestionnairesExpl', 'click', 'click');

		window.location.href = getNextLocationPostTask();
	});
});


var countExpl = 0;
function loadPostTask() {
	console.log(countExpl)
	countExpl++;
	if(countExpl===1){
		$('#button_postTaskQuestionnairesExpl').css('display', 'flex')
	}
}