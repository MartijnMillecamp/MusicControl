var slideIndex = 1;

$( document ).ready(function() {
	$('#button_demo').click(function (event) {
		window.location.href = base + '/attributes';
	});



	showSlides(slideIndex)






});

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i;
	var slides = document.getElementsByClassName("mySlides");
	// var dots = document.getElementsByClassName("dot");
	if (n > slides.length) {slideIndex = 1}
	if (n < 1) {slideIndex = slides.length}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	// for (i = 0; i < dots.length; i++) {
	// 	dots[i].className = dots[i].className.replace(" active", "");
	// }
	slides[slideIndex-1].style.display = "block";
	// dots[slideIndex-1].className += " active";


	if(slideIndex === slides.length){
		$('#button_demo').css('display', 'block')
	}
	else{
		$('#button_demo').css('display', 'none')
	}
}

