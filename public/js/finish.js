$(document).ready(function () {
	showPlaylist()
	
	
	$('#export_playlist').click(function () {
		exportPlaylist()
	})
	
})

function showPlaylist() {
	var query = base + '/getPlaylist?userId=' + userID;

	$.getJSON(query, function (playlistEntry) {
		if( playlistEntry === null){
			console.log('do nothing')
		}
		else{
			console.log('do something')
			var playlist = playlistEntry.playlist;
			playlist.forEach(function (trackId) {
				showSong(trackId)
			})
		}
	});
	
	
}




function showSong(trackId) {
	var query = '/getSongPlaylist?token=' + spotifyToken + '&trackId=' + trackId;
	$.getJSON(query, function (song) {
		console.log(song)

		if(song !== null){
			var template = Handlebars.templates['attributeSong'];
			var html = template(song);
			$('#playlist').append(html);
		}
	})
}


function getExampleSong(trackId, divId) {
	var template = Handlebars.templates['attributeSong'];
	var html = template(song)
	$('#playlist').append(html)
}

function exportPlaylist() {
	var adminquery = '?token=' + spotifyToken + '&userId=' + userID
	var playlistquery = '&playlistName=augmentKULeuven';
	var query = base + 'createPlaylist' + adminquery + playlistquery;
	$.getJSON( query , function( dataObject ) {
		if (dataObject.error){
			// window.location.href = base + '/error';
			console.log(dataObject.data)
			console.log('not saved')
		}
		else{
			var data = dataObject.data;
			console.log(data)
		}
	});


}