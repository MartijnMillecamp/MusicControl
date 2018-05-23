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

/**
 * Select an artist and do whatever needed
 * @param artist  id of artist you (de)select
 * @param index   if index = -1 you select an artist, otherwise you deselect an artist
 */
function selectArtist(artist, index) {
	//deselect an artist
	if (index !== -1){
		//Don't show warning anymor
		$('.warningLimitNb').css('display','none');
		selectedArtists.splice(index, 1);
		$('#' + artist).removeClass("selected");
		//Show symbol to delete and remove thumbtack
		$('#' + artist + '_delete').css('visibility','visible');
		$('#' + artist + '_thumbtack').css('visibility','hidden');
		//Remove data of artist
		removeRecommendation(artist);
	}
	//select a new artist
	else {
		flashButton(true);
		if (selectedArtists.length >= 5) {
			$('.warningLimitNb').css('display', 'block');
			setTimeout("$('.warningLimitNb').css('display','none')", 3000);
		}
		else {
			$('#' + artist).addClass("selected");
			selectedArtists.push(artist);
			$('#' + artist + '_delete').css('visibility','hidden');
			$('#' + artist + '_thumbtack').css('visibility','visible');
			getRecommendationsArtist(artist)
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

function getRecommendationsArtist(similarArtist) {
	var queryBase = base + '/getRec?token=' +spotifyToken + '&limit=' + 20 + '&artists=' + similarArtist;
	var queryTrackAtrributes = '&target_acousticness=' + targetValues.acousticness + '&target_danceability=' + targetValues.danceability
		+ '&target_energy=' + targetValues.energy + '&target_valence=' + targetValues.valence + '&target_instrumentalness='+targetValues.instrumentalness
		+'&userId=' + userID + '&likedSongs=' + likedSongs.length + '&dislikedSongs=' + dislikedSongs.length;
	var query = queryBase.concat(queryTrackAtrributes);
	$.getJSON( query , function( data ) {
		data.forEach(function (d,i) {
			if(i === data.length-1){
				appendSong(d.id, true, similarArtist, d.name, d.artists, d.duration_ms);
			}
			else{
				appendSong(d.id, false, similarArtist, d.name, d.artists, d.duration_ms);
			}
		});
	});

}


function appendSong(trackId, last, similarArtist, title, artist, duration) {
	$.getJSON(base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist, function (song) {
		if( song === null){
			//Song not in database
			addSong(trackId, last, similarArtist, title, artist, duration);
		}
		else{
			console.log('append already in database')
			appendRecommendation(song, last)
		}

	//	display song

	});
}



function addSong(trackId, last, similarArtist, title, artist, duration) {
	var query = base + '/getAudioFeaturesForTrack?token=' +spotifyToken + '&trackId=' + trackId;
	//get features of song
	$.getJSON( query , function( data ) {
		//add song to database
		var attributes = '&acousticness=' + data.acousticness + '&energy=' + data.energy
		+'&danceability=' + data.danceability + '&instrumentalness=' + data.instrumentalness
		+'&tempo=' + data.tempo + '&valence=' + data.valence ;
		var trackInfo = '&similarArtist=' + similarArtist + '&title=' + title
			+ '&artist=' + artist + '&duration' + duration;
		//add song and append to recommendedsongs
		var query1 = base + '/addSong?trackId=' + trackId + attributes + trackInfo ;
		$.getJSON(query1, function (message) {
			//append song to recommendations
			$.getJSON(base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist, function (song) {
				appendRecommendation(song, last)
			})
		})
	})


}

