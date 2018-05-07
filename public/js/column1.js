
var sliders = [
	{name: 'acousticness', startValue: 50, definition: 'Acousticness: A confidence measure whether the track is acoustic. 100 represents high confidence the track is acoustic.'},
	{name: 'energy', startValue: 50, definition: 'Energy: Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.'},
	{name: 'valence', startValue: 50, definition: 'Valence: A measure describing the musical positiveness conveyed by' +
	' a track. Tracks with high valence sound more positive, while tracks with low valence sound more negative'},
	{name: 'tempo', startValue: 50, definition: 'test'},
	{name: 'instrumentalness', startValue: 50, definition: 'Instrumentalness: Predicts whether a track contains no vocals. Values above 50 are intended to represent instrumental tracks, but confidence is higher as the value approaches 100.'},
	{name: 'danceability', startValue: 50, definition: 'Danceability: Danceability describes how suitable a track is for dancing. 100 represents high confidence the track is danceable.'},
	];



// DOM Ready =============================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	populateArtistList();
	appendSliders();

	$(document).on('click', ".checkSlider", function(event) {
		event.stopPropagation();
		var seed = $(this).parent().parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		var checkbox = $(this).parent();
		var checkSlider = $(this);
		selectArtist(seed, index, checkbox, checkSlider);
		addRecord('checkSlider', 'click', index)

	});

	$(document).on('click', ".checkbox", function(event) {
		//prevent this function to be triggered on click slider
		event.stopPropagation();
		var seed = $(this).parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		var checkbox = $(this);
		var checkSlider = $(this).children();
		selectArtist(seed, index, checkbox, checkSlider)
		addRecord('checkBox', 'click', index)

	});

});

function selectArtist(seed, index, checkbox, slider) {
	//deselect an artist
	if (index !== -1){
		$('.warningLimitNb').css('display','none');
		selectedArtists.splice(index, 1);
		$('#' + seed).removeClass("selected");
		checkbox.removeClass("selected");
		slider.removeClass("selected");
		if(selectedArtists.length === 0){
			flashButton(false)
		}
	}
	//select a new artist
	else {
		flashButton(true);
		if (selectedArtists.length >= 5) {
			$('.warningLimitNb').css('display', 'block');
			setTimeout("$('.warningLimitNb').css('display','none')", 3000);

		}
		else {
			$('#' + seed).addClass("selected");
			checkbox.addClass("selected");
			slider.addClass("selected");
			selectedArtists.push(seed);
		}
	}
}



function populateArtistList() {
	//run handlebars -m views/partials/Components/ -f  public/js/templates.js
	var template = Handlebars.templates['artist'];
	var totalHtml = "";
	$.getJSON( base + '/getArtist?token=' +spotifyToken + '&limit=5', function( data ) {
		data.forEach(function (d) {
			var html = template(d);
			totalHtml += html;
		});
		$( "#artistList" ).append(totalHtml)
	});

};

function appendSliders() {
	var template = Handlebars.templates['slider'];
	var totalHtml = "";
	sliders.forEach(function (d) {
		var html = template(d);
		totalHtml += html;
	})
	$("#sliders").append(totalHtml)
}



