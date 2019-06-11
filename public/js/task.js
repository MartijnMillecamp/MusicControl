
$( document ).ready(function() {

	if(relaxing === "true"){
		$('#slide1').attr('src', "../img/taskRelax.png")
	}
	else{
		$('#slide1').attr('src', "../img/taskFun.png")
	}

	$('#button_task').click(function () {
		addInteraction('button_task', 'click', 'click');
		window.location.href = base + '/home?userId=' + userId ;
	});
});



