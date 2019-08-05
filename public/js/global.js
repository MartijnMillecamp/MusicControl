//Values in cookie
var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');

var userId = $.cookie('userId');
var spotifyId = $.cookie('spotifyId');
//task
var relaxing = $.cookie('relaxing');
var fun = $.cookie('fun');
var sport = $.cookie('sport');

var playable = $.cookie('playable');
var baseline = $.cookie('baseline');
var unplayable = $.cookie('unplayable');
var current = $.cookie('current');
var selectedSliders = JSON.parse($.cookie('selectedSliders'));
var targetValues = JSON.parse($.cookie("targetValues"));


var selectedArtists = [];
var nbOfRecommendations = 12;
var totalNbOfRecommendations = 12;
var nbOfTaskSongs = 5;
var allRecommendations = [];

var base = '';
var dislikedSongs = [];
var likedSongs = [];
var clickedSongs = [];
var playedSongs = [];

var recommendedSongs = [];
var activeArtist = null;

var artists = [];

var defAcousticness = 'Acoustic music is music that solely or primarily uses instruments that produce sound through' +
	' acoustic means, as opposed to electric or electronic means. High represents acoustic music, low represents' +
	' electronic music. 90% of the songs has a very low acousticness';
var defDanceability = 'Danceability describes how suitable a track is for dancing. A high value represents high' +
	' confidence the track is danceable. Most songs have a medium danceability. ' ;
var defDuration = 'Duration is the duration of the track in miliseconds' ;
var defEnergy = 'Energy represents a perceptual measure of intensity and activity. Typically, energetic' +
	' tracks feel fast, loud, and noisy. Most songs have a medium or high energy value.';
var defInstrumentalness = 'Instrumental music is music that contains no vocals. High represents a song with almost no' +
	' vocals, low represents a song with a lot of vocals. Most songs have a very low value.';
var defLiveness = 'Detects the presence of an audience in the recording. ' +
	'Higher liveness values represent an increased probability that the track was performed live. ' +
	'A high value  provides strong likelihood that the track is live. ' ;
var defLoudness = 'The overall loudness of a track in decibels (dB). ' +
	'Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. ' +
	'Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). ' +
	'Values typical range between -20 and 0 db. ' ;
var defPopularity = 'Popularity describes how popular a track is at the moment. A higher value represents a higher' +
	' popularity. Almost all songs have a medium or high popularity. ' ;
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

var currentRecommendations = {};

$(document).ready(function() {
	if (window.location.pathname === '/exploration'){
		nbOfTaskSongs = 0;
		alert("Please EXPLORE the possibilities of the interface " +
			"and click 'Continue' if you think you are ready to create a playlist")
	}
	else if(window.location.pathname === '/home'){
		task = "Please like 5 songs to create a playlist";
    if(fun === 'true' ){
      task += ' you like to listen during a fun activity.'
    }
    else if (relaxing === 'true'){
      task += ' you like to listen during a relaxing activity.'
    }
    else{
      task += ' you like to listen during sports.'
    }
    alert(task)
	}
	
	
	// refresh the token after 3000s (50min)
	setInterval(function () {
		$.getJSON(base + "/refresh-token?refreshToken=" + refreshToken, function (data) {
			spotifyToken = data.access_token;

		})
	}, 50*60*1000);

	$('[data-toggle="tooltip"]').tooltip({
		position: {my: "center", at: "center"}
	});

	$('#button_Home').click(function () {
    var pathname = window.location.pathname;
    if (pathname != "/exploration"){
      $.cookie("targetValues", JSON.stringify(targetValues));
      addInteraction('button_home', 'click', current);
  
      //you click too early on the button
      if(likedSongs.length < nbOfTaskSongs){
        //	Not possible anymore
        alert('please like more songs before you can continue')
      }
      else{
        var setAllRecommendations = new Set(allRecommendations);
        var query;
        if(playable === "true"){
          query = base + '/addplaylistPlayable'
        }
        else if(unplayable === "true"){
        	query = base + '/addplaylistUnplayable'
        }
        else(
          query = base + '/addplaylistBaseline'
        );
    
        query += '?userId=' + userId + '&playlist='  + likedSongs + '&disliked=' + dislikedSongs;
        query += '&nbRecommendations=' + setAllRecommendations.size;
        $.getJSON( query, function( message ) {
          // console.log(message)
          window.location.href = base + '/export?userId=' + userId + '&current=' + current;
        });
      }
  
    }
    else{
      $.cookie("targetValues", JSON.stringify(targetValues));
      addInteraction('button_exploration', 'click', current);
      window.location.href = base + '/home?userId=' + userId;
  
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
	if(current === "1"){
		return base + '/exploration?userId=' + userId;
	}
	else if (current === "2"){
    return base + '/exploration?userId=' + userId;
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
	var queryUser = '&userId=' + userId ;
  if (window.location.pathname === '/exploration'){
  	queryUser += "_exploration"
  }
	
	var queryInterface = '&interface=' + current  + '&playable=' + playable + '&unplayable=' + unplayable + '&baseline=' + baseline;
	var queryInteraction = '&date=' + date +  '&element=' + element + '&action=' + action + '&value=' + value;
	var queryTask = '&relaxing=' + relaxing + '&fun=' + fun + '&sport=' + sport;
	var query =  queryBase + queryUser + queryInteraction + queryInterface + queryTask;
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
	alreadyInList = false
	for (var i = 0; i < recommendedSongs.length; i++){
		if (recommendedSongs[i]["trackId"] === song['trackId']){
			alreadyInList = true
		}
	}
	if (!alreadyInList){
    recommendedSongs.push(song);
  }
  
  var set = new Set(recommendedSongs);
  recommendedSongs = Array.from(set);
  
  var index = appendedSongslist.indexOf(song.trackId);
	if (index > -1) {
		appendedSongslist.splice(index, 1);
	}
	if(appendedSongslist.length === 0 ){
		// updateScatterplot(recommendedSongs, similarArtist);
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

	// updateScatterplot(recommendedSongs, artistId);
	// updateRecommendations(recommendedSongs, null);
	//Delete all recommendations of this artist
  $('#recList_' + artistId).css("display", "none");
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



