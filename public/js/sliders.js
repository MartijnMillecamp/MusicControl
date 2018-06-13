
// DOM Ready =============================================================
$(document).ready(function() {

});

function appendSliders() {
	var template = Handlebars.templates['slider'];
	var totalHtml = "";
	sliders.forEach(function (d) {
		totalHtml += template(d);
	});
	$("#sliders").append(totalHtml)

	var acousticness_Slider = document.getElementById("acousticness_Slider");
	var instrumentalness_Slider = document.getElementById("instrumentalness_Slider");
	var danceability_Slider = document.getElementById("danceability_Slider");
	var valence_Slider = document.getElementById("valence_Slider");
	var energy_Slider = document.getElementById("energy_Slider");
	var tempo_Slider = document.getElementById("tempo_Slider");

	acousticness_Slider.oninput = function() {
		var color = $(this).attr('color');
		updateSlider("acousticness", this.value / 100.0, this.value, color);
	};
	energy_Slider.oninput = function() {
		var color = $(this).attr('color');
		updateSlider("energy", this.value / 100.0, this.value, color);
	};

	danceability_Slider.oninput = function() {
		var color = $(this).attr('color');
		updateSlider("danceability", this.value / 100.0, this.value, color);
	};
	instrumentalness_Slider.oninput = function() {
		var color = $(this).attr('color');
		updateSlider("instrumentalness", this.value / 100.0, this.value, color);
	};

	tempo_Slider.oninput = function() {
		var color = $(this).attr('color');
		updateSlider("tempo", (this.value * 2) + 40, this.value, color);
	};

	valence_Slider.oninput = function() {
		var color = $(this).attr('color');
		updateSlider("valence", this.value / 100.0, this.value, color);
	};

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
		getRecommendationsAllArtists()
	});

}

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

function getStartValues(){
	$.getJSON( base + '/getTopSongs?token=' +spotifyToken + '&limit=5', function( data ) {
		var topTrackIdList = [ ];
		if(data !== null){
			data.forEach(function (d) {
				topTrackIdList.push(d.id)
			});
			var query = base + '/getAudioFeaturesForTracks?token=' +spotifyToken + '&trackIds=' + topTrackIdList ;
			$.getJSON( query , function( data ) {
				calculateStartValues(data['audio_features'])
			})
		}
	});
}

function calculateStartValues(data){
	var avgAcousticness = 0;
	var avgDanceability = 0;
	var avgEnergy = 0;
	var avgInstrumentalness = 0;
	var avgTempo = 0;
	var avgValence = 0;
	var length = data.length
	data.forEach(function (songData) {
		avgAcousticness += songData.acousticness * 100;
		avgDanceability += songData.danceability * 100;
		avgEnergy += songData.energy * 100;
		avgInstrumentalness += songData.instrumentalness * 100;
		avgTempo += (songData.tempo - 40)/2;
		avgValence += songData.valence * 100;
	});
	avgAcousticness = Math.round(avgAcousticness / length) ;
	avgDanceability=  Math.round(avgDanceability / length);
	avgEnergy =  Math.round(avgEnergy / length);
	avgInstrumentalness =  Math.round(avgInstrumentalness / length);
	avgTempo= Math.round(avgTempo / length);
	avgValence = Math.round(avgValence / length);

	changeStartValues(avgAcousticness, avgDanceability, avgEnergy, avgInstrumentalness, avgTempo, avgValence)
}

function changeStartValues(acousticness, danceability, energy, instrumentalness, tempo, valence ) {
	var attrList = [ "acousticness", "danceability", "energy", "instrumentalness", "tempo", "valence"];
	var attrListValues = [ acousticness, danceability, energy, instrumentalness, tempo, valence];


	for ( var i=0; i < attrList.length; i++){
		sliders[i]['startValue'] = attrListValues[i];
		var name = attrList[i]
		targetValues[name] = attrListValues[i]

	}
	appendSliders();

}

