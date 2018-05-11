//todo search tooltip + explanation tooltip
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
		event.stopPropagation();
		var targetClass = $(event.target).attr('class')
		if (targetClass != 'far fa-times-circle'){
			var seed = $(this).attr('id');
			var index = $.inArray(seed, selectedArtists);
			selectArtist(seed, index);

		}

	});

	$(document).on('click', ".fa-times-circle", function(event) {
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
			getRecommendations()
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

/*
Ask recommendations to Spotify based on
selected artist
music attributes
 */
function getRecommendations() {
	var queryBase = base + '/getRec?token=' +spotifyToken + '&limit=' + 2 + '&artists=' + selectedArtists;
	var queryTrackAtrributes = '&target_acousticness=' + targetValues.acousticness + '&target_danceability=' + targetValues.danceability
		+ '&target_energy=' + targetValues.energy + '&target_valence=' + targetValues.valence + '&target_instrumentalness='+targetValues.instrumentalness
		+'&userId=' + userID + '&likedSongs=' + likedSongs.length + '&dislikedSongs=' + dislikedSongs.length;
	var query = queryBase.concat(queryTrackAtrributes);

	$.getJSON( query , function( data ) {
		data.forEach(function (d) {
			displaySong(d.id);
		});
	});

}

function displaySong(trackId) {
	$.getJSON(base + '/getSong?trackId=' + trackId, function (song) {
		if( song == null){
			//Song not in database
			console.log('add to database');
			addSong(trackId, 10,20)
		}
		else{
			//song in database
			console.log('visualize')
		}
	})
}

function makeScatterPlot() {
	var template = Handlebars.templates['song'];
	var totalHtml = "";
	var html = template(d);
	totalHtml += html;
	$( "#scatterplot" ).append(totalHtml)

}


function addSong(trackId, energy, acousticness) {
	var query = base + '/getAudioFeaturesForTrack?token=' +spotifyToken + '&trackId=' + trackId;
	$.getJSON( query , function( data ) {
		var query1 = base + '/addSong?trackId=' + trackId + '&energy=' + data.energy + '&acousticness=' + data.acousticness;
		$.getJSON(query1, function (message) {
			console.log(message)
		})
	})


}

function getSong(trackId) {
	$.getJSON(base + '/getSong?trackId=' + trackId, function (song) {
		if( 'error' in song){
			return null
		}
		else{
			console.log(song)
			return song;
		}
	})
}

