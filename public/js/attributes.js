

// DOM Ready =============================================================
$(document).ready(function() {

	sliders.forEach(function (sliderData) {
		makeAttributeContainer(sliderData)
	});
	showExampleSongs()

	$('#button_attributes').click(function () {
		addInteraction('button_attributes', 'click', 'click');
		window.location.href = base + '/task' ;

	});



	$('.showExamplesButton').click(function (event) {
		addInteraction('showExamplesButton', 'click', 'click');
		var button = $(this)
		var buttonName = button.attr('id').split("_")[1];
		var songDiv = $('#songDiv_' + buttonName)
		var hasClass = songDiv.hasClass('selected');
		if(!hasClass){
			songDiv.addClass("selected");
			button.html("Hide Examples")
		}
		else{
			songDiv.removeClass("selected");
			button.html("Show Examples")
		}
	});




});

/**
 * Function that starts displaying the songs
 */
function showExampleSongs() {
	var acousticnessExamples = ['7ef4DlsgrMEH11cDZd32M6','64Tp4KN5U5rtqrasP5a7FH','3U4isOIWM3VvDubwSI3y7a'];
	var danceabilityExamples = ['6hUbZBdGn909BiTsv70HP6','7DFNE7NO0raLIUbgzY2rzm','7qiZfU4dY1lWllzX7mPBI3'];
	var energyExamples = ['3xXBsjrbG1xQIm1xv1cKOt','40riOy7x9W7GXjyGp4pjAv','0EYOdF5FCkgOJJla8DI2Md'];
	var instrumentalnessExamples = ['2374M0fQpWi3dLnB54qaLX','0q6LuUqGLUiCPP1cbdwFs3','5pT4qRIpNb7cASsnMfE1Hc'];
	var tempoExamples = ['3d9DChrdc6BOeFsbrZ3Is0','0ofHAoxe9vBkTCp2UQIavz','3GXhz5PnLdkG4DEWNzL8z8'];
	var valenceExamples = ['6b2oQwSGFkzsMtQruIWm2p','6Qyc6fS4DsZjB2mRW9DsQs','1KsI8NEeAna8ZIdojI3FiT'];


	getExampleSongs(acousticnessExamples, 'acousticness');
	getExampleSongs(danceabilityExamples, 'danceability');
	getExampleSongs(energyExamples, 'energy');
	getExampleSongs(instrumentalnessExamples, 'instrumentalness');
	getExampleSongs(tempoExamples, 'tempo');
	getExampleSongs(valenceExamples, 'valence');
}

function makeAttributeContainer(data) {
	var template = Handlebars.templates['attributeContainer'];
	var html = template(data);
	$('#totalExampleContainer').append(html);
}

function getExampleSongs(trackIds, name) {
	getExampleSong(trackIds[0], 'low_' + name);
	getExampleSong(trackIds[1], 'medium_' + name);
	getExampleSong(trackIds[2], 'high_' + name);

}

//todo optimize this function
function getExampleSong(trackId, divId) {
	var query = '/getSongFromId?token=' + spotifyToken + '&trackId=' + trackId;
	$.getJSON(query, function (dataObject) {
		if (dataObject.error){
			console.log(dataObject)
			// window.location.href = base + '/error';
		}
		else{
			var d = dataObject.data.body;
			var artist = d.artists[0]['name'];
			var artistId = d.artists[0]['id'];
			//	get the image of the artist
			var query = '/getArtist?token=' + spotifyToken + '&artistId=' + artistId;
			$.getJSON(query, function (dataObject) {
				if (dataObject.error) {
					window.location.href = base + '/auth/spotify';
				}
				var data = dataObject.data;
				var image = getArtistImage(data);
				appendAttributeSong(d.id, artist, d.name, artist, d.duration_ms, d.external_urls['spotify'], d.preview_url, image, divId);
			})
		}
	})
}

//todo optimize this function
function appendAttributeSong(trackId, similarArtist, title, artist, duration, url, preview, image, divId) {
	var query = base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist;

	$.getJSON(query, function (song) {
		if( song === null){
			//Song not in database
			addAttributeSong(trackId, similarArtist, title, artist, duration, url, preview, image, divId);
		}
		else{
			displayAttributeSong(song, divId)
		}
	});
}

function addAttributeSong(trackId, similarArtist, title, artist, duration, url, preview, image, divId) {
	var query = base + '/getAudioFeaturesForTrack?token=' +spotifyToken + '&trackId=' + trackId;
	//get features of song
	$.getJSON( query , function( dataObject ) {
		if (dataObject.error){
			window.location.href = base + '/error';
		}
		var data = dataObject.data;
		//add song to database
		var attributes = '&acousticness=' + data.acousticness + '&energy=' + data.energy
			+'&danceability=' + data.danceability + '&instrumentalness=' + data.instrumentalness
			+'&tempo=' + data.tempo + '&valence=' + data.valence ;
		var trackInfo = '&similarArtist=' + similarArtist + '&title=' + title
			+ '&artist=' + artist + '&duration=' + duration + '&url=' + url + '&preview=' + preview+ '&image=' + image;
		//add song and append to recommendedsongs
		var query1 = base + '/addSong?trackId=' + trackId + attributes + trackInfo ;
		$.getJSON(query1, function (message) {
			$.getJSON(base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist, function (song) {
				displayAttributeSong(song, divId)
			})
		})
	})
}

function displayAttributeSong(song, divId){
	var template = Handlebars.templates['attributeSong'];
	var html = template(song)
	$('#' + divId).append(html)
}