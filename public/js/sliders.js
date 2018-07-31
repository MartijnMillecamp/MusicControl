
// DOM Ready =============================================================
$(document).ready(function() {



});

function appendSliders() {
	var template = Handlebars.templates['slider'];
	var totalHtml = "";
	sliders.forEach(function (d) {
		totalHtml += template(d);
	});
	$("#sliders").append(totalHtml);

	var acousticness_Slider = document.getElementById("acousticness_Slider");
	var instrumentalness_Slider = document.getElementById("instrumentalness_Slider");
	var danceability_Slider = document.getElementById("danceability_Slider");
	var valence_Slider = document.getElementById("valence_Slider");
	var energy_Slider = document.getElementById("energy_Slider");
	var tempo_Slider = document.getElementById("tempo_Slider");

	acousticness_Slider.oninput = function() {
		updateSlider("acousticness", this.value / 100.0, this.value);
	};
	energy_Slider.oninput = function() {
		updateSlider("energy", this.value / 100.0, this.value);
	};

	danceability_Slider.oninput = function() {
		updateSlider("danceability", this.value / 100.0, this.value);
	};
	instrumentalness_Slider.oninput = function() {
		updateSlider("instrumentalness", this.value / 100.0, this.value);
	};

	tempo_Slider.oninput = function() {
		updateSlider("tempo", Math.round(1.6*this.value + 40 ), this.value);
	};

	valence_Slider.oninput = function() {
		updateSlider("valence", this.value / 100.0, this.value);
	};

	$(".slider").change(function () {
		addInteraction($(this).attr('id'), 'drop', $(this).attr('value'));
		getRecommendationsAllArtists()
	});

	// $('.fa-question-circle').click(function () {
	// 	$('#attributesModal').css('display', 'block');
	// })
	//
	// $(".close").click(function () {
	// 	$('#attributesModal').css('display', 'none');
	//
	// })


}

function updateSlider(id, targetValue, value){
	var color = getAttributeColor(id);
	var html = id + ": " + value;
	if(id ==='tempo'){
		var bpm = Math.round(1.6*value + 40 );
		html += " (BPM=" + bpm + ")"
	}
	var pixelAdjustment = -0.25* value + 12.5;
	var percentageAdjustment = pixelAdjustment / 5.76;
	var pixelValue = parseInt(value) + percentageAdjustment;
	var sliderId = '#' + id + '_Slider';
	var background = 'linear-gradient(90deg,' + color + ' ' + pixelValue + '%, rgba(53, 53, 53, 1) ' + pixelValue + '%)';
	$(sliderId).css('background', background);
	var output = document.getElementById(id + '_output');
	output.innerHTML = html;
	targetValues[id] = targetValue;


}







