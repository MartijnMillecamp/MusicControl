
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
		var id = d.name;
		if ( id === 'tempo'){
			targetValues['min_' + id] = 0;
			targetValues['max_' + id] = 250;
			$( '#' + id + "_slider_div" ).slider({
				range: true,
				step:1,
				min: 0,
				max: 250,
				values: [ 0, 250 ],
				slide: function( event, ui ) {
					$( "#" + id + '_output' ).val( " " +ui.values[ 0 ] + " - " + ui.values[ 1 ] );
					targetValues['min_' + id] = ui.values[ 0 ];
					targetValues['max_' +id ] = ui.values[ 1 ];
					getRecommendationsAllArtists()
				}
			});
		} else{
			targetValues['min_' + id] = 0;
			targetValues['max_' + id] = 100;
			$( '#' + id + "_slider_div" ).slider({
				range: true,
				step:1,
				min: 0,
				max: 100,
				values: [ 0, 100 ],
				slide: function( event, ui ) {
					$( "#" + id + '_output' ).val( " " +ui.values[ 0 ] + " - " + ui.values[ 1 ] );
					targetValues['min_' + id] = ui.values[ 0 ];
					targetValues['max_' +id ] = ui.values[ 1 ];
					getRecommendationsAllArtists()

				}
			});
		}

		var color = getAttributeColor(id);
		$('#' + id + '_slider_div > .ui-slider-range').css('background', color)

	})
}








