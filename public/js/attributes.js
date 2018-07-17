

// DOM Ready =============================================================
$(document).ready(function() {
	console.log('attributes')
	getExampleSong('7ef4DlsgrMEH11cDZd32M6', 'low_acousticness');
	getExampleSong('64Tp4KN5U5rtqrasP5a7FH', 'medium_acousticness');
	getExampleSong('3U4isOIWM3VvDubwSI3y7a', 'high_acousticness');

});

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
			window.location.href = base + '/auth/spotify';
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
	console.log(song)
	console.log(html)
	$('#' + divId).append(html)
}