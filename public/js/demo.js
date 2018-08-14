var slideIndex = 1;

$( document ).ready(function() {

	if(explanations === "true"){
		$('#slide3').attr('src', "../img/demo/Slide3.png")
		$('#demoVideo').attr('src', "../video/explanations.mp4")
		$("#demoExpl")[0].load();
	}
	else{
		$('#slide3').attr('src', "../img/demo/Slide2.png")
		$('#demoVideo').attr('src', "../video/baseline.mp4")
		$("#demoExpl")[0].load();

	}


	$('#button_demo').click(function (event) {
		window.location.href = base + '/attributes';
	});

	document.getElementById('demoExpl').addEventListener('ended', endVideo ,false);
	function endVideo(e) {
		// What you want to do after the event
		$('.nextSlide').css('display','block')
	}



	showSlides(slideIndex)

});

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	if(n ===1){
		$('.prevSlide').css('display','none')
		$('.nextSlide').css('display','block')
	}
	else if(n===2){
		$('.prevSlide').css('display','block')
		$('.nextSlide').css('display','none')
	}
	else if(n===3){
		$('.prevSlide').css('display','block')
		$('.nextSlide').css('display','block')
	}
	else if(n === 4){
		$('.prevSlide').css('display','block')
		$('.nextSlide').css('display','none')
	}
	else if(n === 5){
		$('.prevSlide').css('display','none')
		$('.nextSlide').css('display','block')
	}

	var i;
	var slides = document.getElementsByClassName("mySlides");
	// var dots = document.getElementsByClassName("dot");
	if (n > slides.length) {slideIndex = 1}
	if (n < 1) {slideIndex = slides.length}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}

	slides[slideIndex-1].style.display = "block";


	if(slideIndex === slides.length){
		$('#button_demo').css('display', 'block')
	}
	else{
		$('#button_demo').css('display', 'none')
	}
}

