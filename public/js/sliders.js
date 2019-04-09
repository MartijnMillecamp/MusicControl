
// DOM Ready =============================================================
$(document).ready(function() {
	appendSliders()




});

function appendSliders() {
	var template = Handlebars.templates['dubbleslider'];
	var totalHtml = "";
	sliders.forEach(function (d) {
		totalHtml += template(d);
	});
	$("#sliders").append(totalHtml);

	sliders.forEach(function (d) {
		var id = d.name
		$( '#' + id + "_slider_div" ).slider({
			range: true,
			step:1,
			min: 0,
			max: 100,
			values: [ 0, 100 ],
			slide: function( event, ui ) {
				if (id == 'tempo'){
					$( "#" + id + '_output' ).val( " " + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
					// targetValues[id] = targetValue;
				}
				else{
					$( "#" + id + '_output' ).val( " " +ui.values[ 0 ] + " - " + ui.values[ 1 ] );
					// targetValues[id] = targetValue;
				}

			}
		});
		var color = getAttributeColor(id);
		$('#' + id + '_slider_div > .ui-slider-range').css('background', color)

	})





	// acousticness_Slider.oninput = function() {
	// 	updateSlider("acousticness", this.value / 100.0, this.value);
	// };
	// energy_Slider.oninput = function() {
	// 	updateSlider("energy", this.value / 100.0, this.value);
	// };
	//
	// danceability_Slider.oninput = function() {
	// 	updateSlider("danceability", this.value / 100.0, this.value);
	// };
	// instrumentalness_Slider.oninput = function() {
	// 	updateSlider("instrumentalness", this.value / 100.0, this.value);
	// };
	//
	// tempo_Slider.oninput = function() {
	// 	updateSlider("tempo", Math.round(1.6*this.value + 40 ), this.value);
	// };
	//
	// valence_Slider.oninput = function() {
	// 	updateSlider("valence", this.value / 100.0, this.value);
	// };
	//
	// $(".slider").change(function () {
	// 	if(selectedArtists.length > 0){
	// 		disableAllInput()
	// 	}
	// 	var slider = $(this).attr('id').split('_')[0]
	// 	var value = targetValues[slider]
	// 	addInteraction($(this).attr('id'), 'drop', value);
	// 	getRecommendationsAllArtists()
	// });

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







