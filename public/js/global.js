//Values in cookie
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');
var userNumber = $.cookie('userNumber');
var interfaceNumber = parseInt($.cookie('interfaceNumber'));


var selectedArtists = [];
var nbOfRecommendations = 7;
var nbOfTaskSongs = 1;
var allRecommendations = []

var base = '';
var dislikedSongs = [];
var likedSongs = [];
var clickedSongs = [];
var playedSongs = [];
var targetValues = {
	acousticness: 0.5,
	danceability: 0.50,
	energy: 0.50,
	instrumentalness: 0.5,
	tempo: 120,
	valence: 0.50
};
var recommendedSongs = [];
var activeArtist = null;

var colorList = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];
var artists = [];
var shapeList = ['cross', 'circle', 'triangle-down', 'square', 'diamond','triangle-up'];

var defAcousticness = 'Acoustic music is music that solely or primarily uses instruments that produce sound through' +
	' acoustic means, as opposed to electric or electronic means. 100 represents acoustic music, 0 represents electronic music.';
var defDanceability = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defEnergy = 'Energy represents a perceptual measure of intensity and activity. Typically, energetic' +
	' tracks feel fast, loud, and noisy.';
var defInstrumentalness = 'Instrumental music is music that contains no vocals. 100 represents a song with almost no' +
	' vocals, 0 represents a song with a lot of vocals.';
var defTempo= 'Tempo is the speed or pace of a given piece and derives directly from the' +
	' average beat duration.';
var defValence = 'Valence is a measure describing the musical positiveness conveyed by a track. Tracks with high' +
	' valence sound more positive, while tracks with low valence sound more negative.';

var sliders = [
	{name: 'acousticness', startValue: 50, color: 'rgb(156,240,225)', definition: defAcousticness, label: 'black'},
	{name: 'danceability', startValue: 50, color: 'rgb(206,245,100)', definition: defDanceability, label: 'black'},
	{name: 'energy', startValue: 50, color: 'rgb(249,229,44)', definition: defEnergy, label: 'black'},
	{name: 'instrumentalness', startValue: 50, color: 'rgb(200,125,86)', definition: defInstrumentalness, label: 'white'},
	{name: 'tempo', startValue: 50, color: 'rgb(255,100,54)', definition: defTempo, label: 'white'},
	{name: 'valence', startValue: 50, color: 'rgb(181,155,200)', definition: defValence, label: 'white'}
];


$(document).ready(function() {
	// refresh the token after 3000s (50min)
	setInterval(function () {
		$.getJSON(base + "/refresh-token?refreshToken=" + refreshToken, function (data) {
			console.log(data);
			spotifyToken = data.access_token;

		})
	}, 50*60*1000);

	$('[data-toggle="tooltip"]').tooltip({
		position: {my: "center", at: "center"}
	});



});


/**
 * Add interaction to database
 * @param element
 * @param action
 * @param value
 */
function addInteraction(element, action, value) {
	var url_string = window.location.href;
	var url = new URL(url_string);
	var interfaceNumber = url.searchParams.get("interfaceNumber");
	var date = new Date().getTime();
	var queryBase = base + '/addInteraction?';
	var queryUser = 'userName=' + userName + '&userId=' + userID + '&userNumber=' + userNumber;
	var queryInteraction = '&date=' + date + '&interfaceNumber=' + interfaceNumber + '&element=' + element + '&action=' + action + '&value=' + value;
	var query =  queryBase + queryUser + queryInteraction;
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
 * @param similarArtist
 * @param appendedSongslist
 */
function appendRecommendationsArtist(song, similarArtist, appendedSongslist){
	recommendedSongs.push(song);
	var index = appendedSongslist.indexOf(song.trackId);
	if (index > -1) {
		appendedSongslist.splice(index, 1);
	}
	if(appendedSongslist.length === 0 ){
		updateScatterplot(recommendedSongs, similarArtist);
		updateRecommendations(recommendedSongs, similarArtist, activeArtist);
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
	// updateRecommendations(recommendedSongs, null);
	//Delete all recommendations of this artist
	$('#recList_' + artistId).html("");

}

function getArtistColor(artistId){
	var artistIndex = selectedArtists.indexOf(artistId);
	if (artistIndex === -1){ return "grey"}
	else{
		return colorList[artistIndex]
	}
}

/**
 * Function to return the symbol linked to the artist
 * Need to be artist and not selectedartists
 * otherwise you have a bug if you remove an artist
 * (2 times same symbol)
 * @param artistId
 * @returns The symbol linked with the artist
 */
function getArtistShape(artistId){
	return 'circle';
	// var artistIndex = artists.indexOf(artistId);
	// if (artistIndex === -1){
	// 	if(artistId === "attributeValues"){
	// 		return 'triangle-down'
	// 	}
	// 	else{
	// 		return shapeList[0]
	// 	}
	// }
	// else{
	// 	return shapeList[artistIndex]
	// }
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

function getAttributeLabelColor(attribute, value) {
	var color = 'white';
	if(value > 20){
		sliders.forEach(function (d) {
			if(d['name'] === attribute){
				color = d['label']
			}
		})
	}

	return color;
}


