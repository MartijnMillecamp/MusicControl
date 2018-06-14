


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
	console.log(dict)
	return dict
}

function updateProfile() {
	[dict, nbLikedSongs] = getPlaylistValues()
	var profile = makeProfile(dict, nbLikedSongs)
	profile = $.map(profile, function(e){
		return { name: e.key, value: e.val };
	});
	makeProfileBarchart(profile, )
}