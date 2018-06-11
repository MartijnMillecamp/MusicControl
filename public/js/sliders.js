


// DOM Ready =============================================================
$(document).ready(function() {

	var template = Handlebars.templates['slider'];
	sliders.forEach(function (d) {
		var html = template(d);
		$('#modVisSliders').append(html)
	})



	var acousticness_Slider = document.getElementById("acousticness_Slider");
	var instrumentalness_Slider = document.getElementById("instrumentalness_Slider");
	var danceability_Slider = document.getElementById("danceability_Slider");
	var valence_Slider = document.getElementById("valence_Slider");
	var energy_Slider = document.getElementById("energy_Slider");
	var tempo_Slider = document.getElementById("tempo_Slider");

	var myTimeout;

	$( ".slidecontainer" ).hover(
		function(){
			//mouseenter
			var id = $(this).attr('id')
			myTimeout = setTimeout(function() {
				$('#' + id + '_tooltip').css('display', 'block')
			}, 300);
		},
		function(){
			//mouseleave
			$('#' + this.id + '_tooltip').css('display', 'none');
			clearTimeout(myTimeout);
		}
	);

	$(".slider").mouseup(function () {
		//Remove all songs from list and start over again
		recommendedSongs = [];
		var nbSelectedArtists = selectedArtists.length;
		//For each artist calculate new rec based on new values
		for (var i=0; i< nbSelectedArtists; i++){
			var artist = selectedArtists[i];
			if(i===nbSelectedArtists-1){
				getRecommendationsArtist(artist, true);
			}
			else{
				getRecommendationsArtist(artist, false)
			}
		}

	});



	acousticness_Slider.oninput = function() {
		var color = $(this).attr('color')
		updateSlider("acousticness", this.value / 100.0, this.value, color);
	};
	instrumentalness_Slider.oninput = function() {
		var color = $(this).attr('color')
		updateSlider("instrumentalness", parseInt(this.value), this.value, color);
	};
	danceability_Slider.oninput = function() {
		var color = $(this).attr('color')
		updateSlider("danceability", this.value / 100.0, this.value, color);
	};
	valence_Slider.oninput = function() {
		var color = $(this).attr('color')
		updateSlider("valence", this.value / 100.0, this.value, color);
	};
	energy_Slider.oninput = function() {
		var color = $(this).attr('color')
		updateSlider("energy", this.value / 100.0, this.value, color);
	};

	tempo_Slider.oninput = function() {
		var color = $(this).attr('color')
		updateSlider("tempo", this.value / 100.0, this.value, color);
	};

});

function updateSlider(id, targetValue, value, color){
	var pixelAdjustment = -0.25* value + 12.5;
	var percentageAdjustment = pixelAdjustment / 5.76;
	var pixelValue = parseInt(value) + percentageAdjustment;
	var sliderId = '#' + id + '_Slider';
	var background = 'linear-gradient(90deg,' + color + ' ' + pixelValue + '%, rgba(53, 53, 53, 1) ' + pixelValue + '%)';
	$(sliderId).css('background', background);
	var output = document.getElementById(id);
	output.innerHTML = id + ": " + value;
	targetValues[id] = targetValue;
}

