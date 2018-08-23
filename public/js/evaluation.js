$( document ).ready(function() {
	var src = "https://docs.google.com/forms/d/e/1FAIpQLScv02GWUgovQC8r7fVk9MIfxfhf1f_R8E_d3Nl3tTT2hVDl1w/viewform?usp=pp_url&entry.1328749061=";
	src += userID ;
	document.getElementById('iframeEvaluation').src = src;

	$('#button_evaluation').click(function (event) {
		addInteraction('button_evaluation', 'click', 'click');
		window.location.href = base + '/thanks';
	});
});

var count = 0;
function load() {
	count++;
	if(count===2){
		$('#button_evaluation').css('display', 'flex')
	}
}