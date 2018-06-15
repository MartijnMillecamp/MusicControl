


$(document).ready(function () {
	

});

function getPlaylistValues() {
	var playlistAttributes = {
		'acousticness':0,
		'danceability':0,
		'energy':0,
		'instrumentalness':0,
		'tempo':0,
		'valence':0
	};
	var likedSongs = $('.likedSong');
	for (var j = 0; j<likedSongs.length; j++){
		console.log(likedSongs[j])
		console.log($(likedSongs[j]).attr('id'))
	}
	var bars = likedSongs.find('.barBackground');
	for (var i=0; i<bars.length; i++) {
		var bar = bars[i];
		var barName = bar['__data__']['name'];
		var barValue = bar['__data__']['value'];
		playlistAttributes[barName] += barValue
	}
	return [playlistAttributes, likedSongs.length]
}

function makeProfile(dict, nbLikedSong) {
	Object.keys(dict).map(function(key) {
		dict[key] = Math.round(dict[key] / nbLikedSong);
	});
	return dict
}

function updateProfile() {
	[dict, nbLikedSongs] = getPlaylistValues();
	var profile = makeProfile(dict, nbLikedSongs);

	var dataPlaylist = [];
	Object.keys(profile).map(function(key) {
		dataPlaylist.push({name: key, value: profile[key]})

	});
	makeProfileBarchart(dataPlaylist, 500,200)
}