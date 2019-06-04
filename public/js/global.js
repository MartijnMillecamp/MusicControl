//Values in cookie
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');
var userNumber = $.cookie('userNumber');
var relaxing = $.cookie('relaxing');
var fun = $.cookie('fun');
var explanations = $.cookie('explanations');
var baseline = $.cookie('baseline');
var first = $.cookie('first');
var date = $.cookie('date');
var selectedSliders = JSON.parse($.cookie('selectedSliders'));



var selectedArtists = [];
var nbOfRecommendations = 10;
var totalNbOfRecommendations = 10;
var nbOfTaskSongs = 15;
var allRecommendations = []

var base = '';
var dislikedSongs = [];
var likedSongs = [];
var clickedSongs = [];
var playedSongs = [];
var targetValues = {
	min_acousticness: 0, max_acousticness: 100,
	min_danceability: 0, max_danceability: 100,
	min_duration: 0, max_duration:100,
	min_energy: 0, max_energy: 100,
	min_instrumentalness: 0, max_instrumentalness: 100,
	min_liveness: 0, max_liveness: 100,
	min_loudness: 0, max_loudness: 100,
	min_popularity: 0, max_popularity: 100,
	min_speechiness: 0, max_speechiness: 100,
  min_tempo: 0, max_tempo: 250,
	min_valence: 0, max_valence: 100
};
var recommendedSongs = [];
var activeArtist = null;

var artists = [];

var defAcousticness = 'Acoustic music is music that solely or primarily uses instruments that produce sound through' +
	' acoustic means, as opposed to electric or electronic means. 100 represents acoustic music, 0 represents' +
	' electronic music. Most songs have an acousticness between 0 and 20';
var defDanceability = 'Danceability describes how suitable a track is for dancing. 100 represents high' +
	' confidence the track is danceable. Most songs have a danceability between 40 and 85. ' ;
var defDuration = 'Duration is the duration of the track in miliseconds' ;
var defEnergy = 'Energy represents a perceptual measure of intensity and activity. Typically, energetic' +
	' tracks feel fast, loud, and noisy. Most songs have an energy value between 65 and 95.';
var defInstrumentalness = 'Instrumental music is music that contains no vocals. 100 represents a song with almost no' +
	' vocals, 0 represents a song with a lot of vocals. Most songs have a value between 0 and 10.';
var defLiveness = 'Detects the presence of an audience in the recording. ' +
	'Higher liveness values represent an increased probability that the track was performed live. ' +
	'A value above 0.8 provides strong likelihood that the track is live. ' ;
var defLoudness = 'The overall loudness of a track in decibels (dB). ' +
	'Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. ' +
	'Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). ' +
	'Values typical range between -20 and 0 db. ' ;
var defPopularity = 'Popularity describes how popular a track is. 100 represents very' +
	' popular. ' ;
var defSpeechiness = 'Speechiness detects the presence of spoken words in a track. ' +
	'The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), ' +
	'the closer to 1.0 the attribute value. Most songs have a speechiness value between 0 and 20 ' ;
var defTempo= 'Tempo is the speed or pace of a given piece and derives directly from the' +
	' average beat duration and measured in beats per minute.';
var defValence = 'Valence is a measure describing the musical positiveness conveyed by a track. Tracks with high' +
	' valence sound more positive, while tracks with low valence sound more negative.';

var sliders = [
	{name: 'acousticness', definition: defAcousticness, minValue: 0, maxValue: 100, selected: false, label: 'black', color: 'grey'},
	{name: 'danceability', definition: defDanceability,  minValue: 0, maxValue: 100, selected: false, label: 'black', color: 'grey'},
	// {name: 'duration',   definition: defDuration,  minValue: 0, maxValue: 600, selected: false, label: 'black', color: 'grey'},
	{name: 'energy',   definition: defEnergy,  minValue: 0, maxValue: 100 ,selected: false, label: 'black', color: 'grey'},
	{name: 'instrumentalness',   definition: defInstrumentalness, minValue: 0, maxValue: 100, selected: false, label: 'black', color: 'grey'},
	// {name: 'liveness',   definition: defLiveness, minValue: 0, maxValue: 100 ,selected: false, label: 'black', color: 'grey'},
	// {name: 'loudness',   definition: defLoudness,  minValue: -50, maxValue: 10 ,selected: false, label: 'black', color: 'grey'},
	{name: 'popularity',   definition: defPopularity,  minValue: 0, maxValue: 100, selected: false, label: 'black', color: 'grey'},
	// {name: 'speechiness',   definition: defSpeechiness,  minValue: 0, maxValue: 100, selected: false, label: 'black', color: 'grey'},
	{name: 'tempo',   definition: defTempo,  minValue: 0, maxValue: 250, selected: false, label: 'black', color: 'grey'},
	{name: 'valence',  definition: defValence,  minValue: 0, maxValue: 100, selected: false, label: 'black', color: 'grey'}
];

var colors = ['rgb(156,240,225)','rgb(249,229,44)', 'rgb(255,84,84)', 'rgb(181,155,200)', 'rgb(206,245,100)',  'rgb(255,149,46)'];
// var colors = [ '#8DD3C7', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3', '#FDB462', '#83DE69', '#FCCDE5'];
var labels = ['black', 'black', 'black', 'white', 'white', 'white'];
var badSongs = [];


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

function removeFromList(list, element) {
	var index = list.indexOf(element);
	if(index > -1){
		list.splice(index,1);
	}
	return list;
}

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

function getColorSlider(name) {
	var color = 'blue';
	sliders.forEach(function (slider) {
		if(slider.name === name){
			color =  slider.color;
		}
	})
	return color

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
	song['similarArtist'] = similarArtist;
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
	console.log(recommendedSongs)
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



