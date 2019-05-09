

var selectedSliders = JSON.parse($.cookie('selectedSliders'));

// DOM Ready =============================================================
$(document).ready(function() {
	appendSliders()
});

function appendSliders() {
	var template = Handlebars.templates['dubbleslider'];
	var totalHtml = "";

	//First append all html for selected sliders
	for(var j=0; j < sliders.length; j++){
		var name = sliders[j].name;

		if(selectedSliders.indexOf(name) > -1){
			totalHtml += template(sliders[j]);		}
	}
	$("#sliders").append(totalHtml);

	var indexVisible = 0;

	//append sliders to the html
	for(var i=0; i<sliders.length; i++){
		var slider = sliders[i];

		var id = slider.name;
		var min = slider.minValue;
		var max = slider.maxValue;
		var visible = false;
		if(selectedSliders.indexOf(id) > -1){
			visible = true;
		}

		targetValues['min_' + id] = min;
		targetValues['max_' + id] = max;


		if( visible){


			$( '#' + id + "_slider_div" ).slider({
				range: true,
				step: 1,
				min: min,
				max: max,
				values: [min, max],
				slide: function (event, ui) {
					var id = $(this).attr('id').split('_')[0];
					console.log(id)
					$("#" + id + '_output').val(" " + ui.values[0] + " - " + ui.values[1]);
					targetValues['min_' + id] = ui.values[0];
					targetValues['max_' + id] = ui.values[1];

				},
				stop: function (event, ui) {
					getRecommendationsAllArtists()
				}
			});

			var color = colors[indexVisible];
			sliders[i].label = labels[indexVisible];
			sliders[i].color = colors[indexVisible];
			$('#' + id + '_slider_div > .ui-slider-range').css('background', color);
			indexVisible += 1;
		}
	}

}








