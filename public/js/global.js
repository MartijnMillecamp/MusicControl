//Values in cookie
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
console.log(refreshToken);
var userID = $.cookie('userId');
var userName = $.cookie('userName');
var userNumber = $.cookie('userNumber');
var relaxing = $.cookie('relaxing');
var fun = $.cookie('fun');
var explanations = $.cookie('explanations');
var baseline = $.cookie('baseline');
var first = $.cookie('first');
var date = $.cookie('date')


var selectedArtists = [];
var nbOfRecommendations = 10;
var totalNbOfRecommendations = 20;
var nbOfTaskSongs = 15;
var allRecommendations = []

var base = '';
var dislikedSongs = [];
var likedSongs = [];
var clickedSongs = [];
var playedSongs = [];
var targetValues = {
	min_acousticness: 0,
	max_acousticness: 100,
	min_danceability: 0,
	max_danceability: 100,
	min_energy: 0,
	max_energy: 100,
	min_instrumentalness: 0,
	max_instrumentalness: 100,
  min_tempo: 0,
	max_tempo: 250,
	min_valence: 0,
	max_valence: 100
};
var recommendedSongs = [];
var activeArtist = null;

var colorList = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];
var artists = [];

var defAcousticness = 'Acoustic music is music that solely or primarily uses instruments that produce sound through' +
	' acoustic means, as opposed to electric or electronic means. 100 represents acoustic music, 0 represents electronic music.';
var defDanceability = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defDuration = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defEnergy = 'Energy represents a perceptual measure of intensity and activity. Typically, energetic' +
	' tracks feel fast, loud, and noisy.';
var defInstrumentalness = 'Instrumental music is music that contains no vocals. 100 represents a song with almost no' +
	' vocals, 0 represents a song with a lot of vocals.';
var defLiveness = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defLoudness = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defPopularity = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defSpeechiness = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. ' ;
var defTempo= 'Tempo is the speed or pace of a given piece and derives directly from the' +
	' average beat duration and measured in beats per minute.';
var defValence = 'Valence is a measure describing the musical positiveness conveyed by a track. Tracks with high' +
	' valence sound more positive, while tracks with low valence sound more negative.';

var sliders = [
	{name: 'acousticness',  color: 'rgb(156,240,225)', definition: defAcousticness, label: 'black', startValue: '0-100', selected: false},
	{name: 'danceability',  color: 'rgb(206,245,100)', definition: defDanceability, label: 'black', startValue: '0-100',selected: false},
	{name: 'duration',  color: 'rgb(206,245,100)', definition: defDuration, label: 'black', startValue: '0-100',selected: false},
	{name: 'energy',  color: 'rgb(249,229,44)', definition: defEnergy, label: 'black', startValue: '0-100',selected: false},
	{name: 'instrumentalness',  color: 'rgb(200,125,86)', definition: defInstrumentalness, label: 'white', startValue: '0-100',selected: false},
	{name: 'liveness',  color: 'rgb(206,245,100)', definition: defLiveness, label: 'black', startValue: '0-100',selected: false},
	{name: 'loudness',  color: 'rgb(206,245,100)', definition: defLoudness, label: 'black', startValue: '0-100',selected: false},
	{name: 'popularity',  color: 'rgb(206,245,100)', definition: defPopularity, label: 'black', startValue: '0-100',selected: false},
	{name: 'speechiness',  color: 'rgb(200,125,86)', definition: defSpeechiness, label: 'white', startValue: '0-100',selected: false},
	{name: 'tempo',  color: 'rgb(255,100,54)', definition: defTempo, label: 'white', startValue: '0-250',selected: false},
	{name: 'valence', color: 'rgb(181,155,200)', definition: defValence, label: 'white', startValue: '0-100',selected: false}
];

var colors = ['rgb(156,240,225)','rgb(206,245,100)','rgb(249,229,44)','rgb(200,125,86)','rgb(255,100,54)','rgb(181,155,200)'];
var labels = ['black', 'black', 'black', 'white', 'white', 'white'];


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

	$('#button_Home').click(function () {
		addInteraction('button_home', 'click', first);

		var current = new Date().getTime();
		var startdate = parseInt(date);
		//you click too early on the button
		if(likedSongs.length < nbOfTaskSongs){
		//	Not possible anymore
			alert('please like more songs before you can continue')
		}
		//you have not spend 3 minutes
		else if(startdate + 180000 > current){
			console.log(current + '-' + startdate)
			alert('Please use this interface for at least 3 minutes. ' +
				'Please continue with exploring and refining your recommendations. ')
		}
		else{
			var setAllRecommendations = new Set(allRecommendations);
			var query;
			if(explanations === "true"){
				query = base + '/addplaylistExpl'
			}
			else(
				query = base + '/addplaylist'
			)


			query += '?userId=' + userID + '&playlist='  + likedSongs ;
			query += '&nbRecommendations=' + setAllRecommendations.size
			$.getJSON( query, function( message ) {
				// console.log(message)
			});
			window.location.href = base + '/finish';
		}

	})



});

function getNextLocationPostTask(){
	if(first === "true"){
		return base + '/demo?userId=' + userID;
	}
	else{
		return base + '/evaluation'
	}
}


/**
 * Add interaction to database
 * @param element
 * @param action
 * @param value
 */
function addInteraction(element, action, value) {

	var url_string = window.location.href;
	var url = new URL(url_string);
	var date = new Date().getTime();
	var queryBase = base + '/addInteraction?';
	var queryUser = 'userName=' + userName + '&userId=' + userID + '&userNumber=' + userNumber;
	var queryInterface = '&first=' + first + '&explanations=' + explanations + '&relaxing=' + relaxing
	var queryInteraction = '&date=' + date +  '&element=' + element + '&action=' + action + '&value=' + value;
	var query =  queryBase + queryUser + queryInteraction + queryInterface;
	$.getJSON(query, function (message) {
		// console.log(message)
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

	updateScatterplot(recommendedSongs, artistId);
	// updateRecommendations(recommendedSongs, null);
	//Delete all recommendations of this artist
	$('#recList_' + artistId).html("");

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

function disableAllInput() {
	$('.artistDiv').addClass('disabled');
	$('.sliders').addClass('disabled');
	$('.slider').prop('disabled', true)
}

function enableAllInput() {
	$('.artistDiv').removeClass('disabled');
	$('.sliders').removeClass('disabled');
	$('.slider').prop('disabled', false)
}



