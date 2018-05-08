
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

	$(document).on('click', ".artistDiv", function(event) {
		console.log("click")
		event.stopPropagation();
		var seed = $(this).attr('id');
		var index = $.inArray(seed, selectedArtists);

		selectArtist(seed, index);
	});

	$(document).on('click', ".fa-times-circle", function(event) {
		event.stopPropagation();
		var seed = $(this).parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		selectArtist(seed, index);
		$(this).parent().remove();

	});

	$(document).on('keypress', '#search', function (e) {
		if (e.which == 13) {
			var query = $('#search').val();
			console.log('search ' + query)
			searchArtist(query)
			$('#search').val('')
		}
	});

});

function selectArtist(seed, index) {
	//deselect an artist
	if (index !== -1){
		$('.warningLimitNb').css('display','none');
		selectedArtists.splice(index, 1);
		$('#' + seed).removeClass("selected");
		$('#' + seed + '_delete').css('visibility','visible');
		$('#' + seed + '_thumbtack').css('visibility','hidden');
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
			selectedArtists.push(seed);
			$('#' + seed + '_delete').css('visibility','hidden');
			$('#' + seed + '_thumbtack').css('visibility','visible');
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

function searchArtist(query) {
	var template = Handlebars.templates['artist'];
	var totalHtml = "";
	var query = '/searchArtist?token=' + spotifyToken + '&q=' + query + '&limit=' + 3;
	$.getJSON(query, function (data) {
		data.forEach(function (d) {
			console.log(d)
			var html = template(d);
			totalHtml += html;
		});
		$( "#artistList" ).append(totalHtml)
	})
}

