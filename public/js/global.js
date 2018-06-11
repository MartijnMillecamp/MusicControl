var selectedArtists = [];
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');
var random = $.cookie('random');
var base = '';
var numberOfSongs = 10;
var dislikedSongs = [];
var likedSongs = [];
var targetValues = {
	acousticness: 0.5,
	instrumentalness: 50,
	valence: 0.50,
	danceability: 0.50,
	energy: 0.50
};
var currentRecommendedSongs = []
var recommendedSongs = [];

var colorList = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];
var artists = [];
var shapeList = ['cross', 'circle', 'triangle-down', 'square', 'diamond','triangle-up']
var shapeHTMLList = ['&#x271A;', '&#9679;', '&#9660;', '&#9726;', '&#9670;', '&#9652;']

var defAcousticness = 'Acousticness: A confidence measure whether the track is acoustic. 100 represents high' +
	' confidence the track is acoustic.';
var defDanceability = 'Danceability: Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable.' ;
var defEnergy = 'Energy: Energy represents a perceptual measure of intensity and activity. Typically, energetic' +
	' tracks feel fast, loud, and noisy.';
var defInstrumentalness = 'Instrumentalness: Predicts whether a track contains no vocals. Values above 50 are' +
	' intended to represent instrumental tracks, but confidence is higher as the value approaches 100.';
var defTempo= ' In musical terminology, tempo is the speed or pace of a given piece and derives directly from the' +
	' average beat duration.';
var defValence = 'Valence: A measure describing the musical positiveness conveyed by a track. Tracks with high' +
	' valence sound more positive, while tracks with low valence sound more negative.';

var sliders = [
	{name: 'acousticness', startValue: 50, color: 'rgb(156,240,225)', definition: defAcousticness},
	{name: 'danceability', startValue: 50, color: 'rgb(206,245,100)', definition: defDanceability},
	{name: 'energy', startValue: 50, color: 'rgb(249,229,44)', definition: defEnergy},
	{name: 'instrumentalness', startValue: 50, color: 'rgb(200,125,86)', definition: defInstrumentalness},
	{name: 'tempo', startValue: 50, color: 'rgb(255,100,54)', definition: defTempo},
	{name: 'valence', startValue: 50, color: 'rgb(181,155,200)', definition: defValence}
];

$(document).ready(function() {
	//refresh the token after 600s (10min)
	setInterval(function () {
		$.getJSON(base + "/refresh-token?refresh_token=" + refreshToken, function (data, err) {
			console.log("data", data)
			if (err)
				console.log(err);
			else {
				spotifyToken = data.access_token;
				refreshToken = data.refresh_token;
			}
		})
	}, 600*1000)

});


function addRecord(element, action, value) {
	var query = base + '/addInteraction?userName=' + userName + '&userId=' + userID + '&element=' + element + '&action=' + action + '&value=' + value;
	$.getJSON(query, function (data) {
		// console.log(data)
	})
}



function flashButton(flash){
	var button = $( "#calculateButton" )
	var flashing = button.hasClass( "flashingButton" );
	if (flash && !flashing){
		button.addClass('flashingButton')
	}
	else if(!flash && flashing){
		button.removeClass('flashingButton')
	}

}

/**
 * Append song to recommendedSongs and update
 * scatterplot and recommendations if needed
 * @param song
 * @param update: update scatterplot if and only if this is true
 */
function appendRecommendationsArtist(song, update, similarArtist){
	recommendedSongs.push(song);
	if(update){
		updateScatterplot(recommendedSongs, similarArtist);
		updateRecommendations(recommendedSongs, similarArtist);
	}
}




function removeRecommendation(artistId) {
	//make list of al songs you need to remove
	var removeList = [];
	recommendedSongs.forEach(function (d,i) {
		if(d.similarArtist === artistId){
			removeList.push(i)
		}
	});
	//remove those songs
	for (var i = removeList.length -1; i >= 0; i--){
		recommendedSongs.splice(removeList[i],1);
	}

	updateScatterplot(recommendedSongs);
	updateRecommendations(recommendedSongs, true);
	//Delete all recommendations of this artist
	$('#recList_' + artistId).html("");
	//Delete tab
	removeTab(artistId)

}

function getArtistColor(artistId){
	var artistIndex = artists.indexOf(artistId);
	if (artistIndex == -1){ return "grey"}
	else{
		return colorList[artistIndex]
	}
}

function getArtistShape(artistId){
	var artistIndex = artists.indexOf(artistId);
	if (artistIndex == -1){ return colorList[0]}
	else{
		return shapeList[artistIndex]
	}
}

function getArtistHTMLShape(artistId){
	var artistIndex = artists.indexOf(artistId);
	if (artistIndex == -1){ return colorList[0]}
	else{
		return shapeHTMLList[artistIndex]
	}
}

function getAttributeColor(attribute) {
	var color = 'grey';
	sliders.forEach(function (d) {
		if(d['name'] === attribute){
			color = d['color']
		}
	})
	return color;
}



