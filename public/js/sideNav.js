function openNav() {
	document.getElementById("mySidenav").style.width = "400px";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
}

function getAttributeValues(collection) {
	var attributes = {
		'acousticness':0,
		'danceability':0,
		'energy':0,
		'instrumentalness':0,
		'tempo':0,
		'valence':0
	};
	for (var i = 0; i < collection.length; i++){
		var song = $('#' + collection[i]);
		var bars = song.find('.barAttr');
		for (var j=0; j<bars.length; j++) {
			var bar = bars[j];
			var barName = bar['__data__']['name'];
			var barValue = bar['__data__']['value'];
			attributes[barName] += barValue
		}
	}
	return [attributes, collection.length]
}

function makeProfile(dict, nbLikedSong) {
	if(nbLikedSong > 0) {
		Object.keys(dict).map(function(key) {
			dict[key] = Math.round(dict[key] / nbLikedSong);
		});

	}
	return dict

}

function updateProfile(collection, svgId) {
	//Sum all attributes in collection
	[dict, nbSongs] = getAttributeValues(collection);
	//make the average
	var avgData = makeProfile(dict, nbSongs);
	var dataBarchart = [];
	Object.keys(avgData).map(function(key) {
		dataBarchart.push({name: key, value: avgData[key]})
	});
	makeProfileBarchart(dataBarchart, 150,120, svgId)
}