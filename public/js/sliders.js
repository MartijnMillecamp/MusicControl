
var colorSliderDict = {acousticness: 'yellow', danceability: 'red', energy: 'blue', instrumentalness: 'green',   tempo: 'purple', valence: 'pink'};
var defAcousticness = 'Acousticness: A confidence measure whether the track is acoustic. 100 represents high' +
	' confidence the track is acoustic.';
var defDanceability = 'Danceability: Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable.' ;
var defEnergy = 'Energy: Energy represents a perceptual measure of intensity and activity. Typically, energetic' +
	' tracks feel fast, loud, and noisy.';
var defInstrumentalness = 'Instrumentalness: Predicts whether a track contains no vocals. Values above 50 are' +
	' intended to represent instrumental tracks, but confidence is higher as the value approaches 100.';
var defTempo= ' In musical terminology, tempo is the speed or pace of a given piece and derives directly from the' +
	' average beat duration.';
var defValence = 'Valence: A measure describing the musical positiveness conveyed by a track. Tracks with high' +
	' valence sound more positive, while tracks with low valence sound more negative.';




var sliders = [
	{name: 'acousticness', startValue: 50, color: 'yellow', definition: defAcousticness},
	{name: 'danceability', startValue: 50, color: 'yellow', definition: defDanceability},
	{name: 'energy', startValue: 50, color: 'yellow', definition: defEnergy},
	{name: 'instrumentalness', startValue: 50, color: 'yellow', definition: defInstrumentalness},
	{name: 'tempo', startValue: 50, color: 'yellow', definition: defTempo},
	{name: 'valence', startValue: 50, color: 'yellow', definition: defValence}
];

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
		console.log($(this).attr('color'))
		updateSlider("acousticness", this.value / 100.0, this.value);
	};
	instrumentalness_Slider.oninput = function() {
		updateSlider("instrumentalness", parseInt(this.value), this.value);
	};
	danceability_Slider.oninput = function() {
		updateSlider("danceability", this.value / 100.0, this.value);
	};
	valence_Slider.oninput = function() {
		updateSlider("valence", this.value / 100.0, this.value);
	};
	energy_Slider.oninput = function() {
		updateSlider("energy", this.value / 100.0, this.value);
	};

	tempo_Slider.oninput = function() {
		updateSlider("tempo", this.value / 100.0, this.value);
	};

});

function updateSlider(id, targetValue, value){
	var pixelAdjustment = -0.25* value + 12.5;
	var percentageAdjustment = pixelAdjustment / 5.76;
	var pixelValue = parseInt(value) + percentageAdjustment;
	var sliderId = '#' + id + '_Slider';
	var background = 'linear-gradient(90deg, #57ab68 ' + pixelValue + '%, rgba(53, 53, 53, 1) ' + pixelValue + '%)'
	$(sliderId).css('background', background);
	var output = document.getElementById(id);
	output.innerHTML = id + ": " + value;
	targetValues[id] = targetValue;
}

