$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLSeIxF2YJ8KFv3Cejz84Aw6NK5XknKZ7ZiyBtSuiRMtJ1vgbkw/viewform?usp=pp_url&entry.1917674808=";
	src += userId ;
	document.getElementById('iframePilotStudy').src = src;

	$('#button_pilotStudy').click(function (event) {
		addInteraction('button_pilotStudy', 'click', 'click');
		window.location.href = base + '/thanks';
	});
});