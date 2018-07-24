// DOM Ready =============================================================
$(document).ready(function() {
	$( document ).tooltip();

	$(document).on('click', ".playButton", function(event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr("id");
		var trackId = buttonId.split("_").pop();
		var audioId = "trackAudio_" + trackId;
		var audio = document.getElementById(audioId);
		//return to play button on ended
		$("#"+audioId).bind("ended", function(){
			button
				.removeClass("fas fa-pause-circle")
				.addClass("fa fa-play-circle");
		});
		if(audio.paused){
			//stop all audio
			var sounds = document.getElementsByTagName('audio');
			for(var i=0; i<sounds.length; i++) sounds[i].pause();
			var trackbuttons = $('.playButton');
			for(var j=0; j<trackbuttons.length; j++) {
				$(trackbuttons[j])
					.removeClass("fas fa-pause-circle")
					.addClass("fa fa-play-circle");
			}
			audio.play();
			button
				.removeClass("fa fa-play-circle")
				.addClass("fas fa-pause-circle");
			if(playedSongs.indexOf(trackId) === -1) {
				playedSongs.push(trackId)
			}
			updateProfile(playedSongs, 'playedSongs');
		}
		else{
			// addInteraction('trackButton', 'click', 0);
			audio.pause();
			button
				.removeClass("fas fa-pause-circle")
				.addClass("fa fa-play-circle");
		}
	});

	$(document).on('click', '.thumbDown', function (event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		dislikeSong(button, trackId);
	});

	$(document).on('click', '.thumbUp', function (event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		likeSong(button, trackId);
	});

	$(document).on('click', '.permanent', function () {
		var trackId = this.id.split('_')[1];
		var popUp = $('#popUp_' + trackId);
		var showPopUpButton = $('#showPopUp_' + trackId);
		var songLink = $('#songLink_' + trackId);
		if ($(this).hasClass('selectedRecommendation')){
			$(this).removeClass('selectedRecommendation');
			songLink.removeClass('selectedRecommendation');
			showPopUpButton.removeClass('selectedShowPopUp')
			popUp.addClass('hidden')
		}
		else{
			if(dislikedSongs.indexOf(trackId) === -1) {
				clickedSongs.push(trackId)
			}
			updateProfile(clickedSongs, 'clickedSongs');
			$(this).addClass('selectedRecommendation');
			songLink.addClass('selectedRecommendation');
			popUp.removeClass('hidden')
			showPopUpButton.addClass('selectedShowPopUp')


		}
	});

	$(document).on('mouseenter','.permanent',function () {
		var trackId = this.id.split('_')[1];
		$('#shape_' + trackId).addClass('selected');

		$('#hoverShape_' + trackId)
			.removeClass('hidden')
			.effect('pulsate', {times:2}, 200)
	});

	$(document).on('mouseleave','.permanent',function () {
		var trackId = this.id.split('_')[1];
		$('#shape_' + trackId).removeClass('selected');
		$('#hoverShape_' + trackId).addClass('hidden')

	});

	$(document).on('click', '.tablinks', function () {
		var artistId = this.id.split('_')[1];
		showArtistTab(artistId)
		showScatterplot(artistId)
	})

	$(document).on('click','.showScatterplot',function () {
		$('#scatterplotContainer').toggle('slow', 'swing');
		$('.showScatterplot').text(function(i, text){
			return text === "Show comparison" ? "Hide comparison" : "Show comparison";
		})
	})
});

function removeUnlikedSongs(similarArtist) {
	var oldSongs = $('#recList_' + similarArtist).children();
	for(var i = 0; i<oldSongs.length; i++){
		var liked = $(oldSongs[i]).hasClass('liked');
		if(!liked){
			$(oldSongs[i]).remove()
		}
	}
}

function updateRecommendations(recommendations, similarArtist){
	//if you update a tab, select that tab
	if(similarArtist !== null){
		showArtistTab(similarArtist);
		showScatterplot(similarArtist);
	}

	removeUnlikedSongs(similarArtist);

	var template = Handlebars.templates['recommendation'];
	recommendations.forEach(function (d) {
		if(d.similarArtist === similarArtist){
			var html = template(d);
			$("#recList_" + d.similarArtist ).append(html);
			var groupedDataSong = [
				{name: 'acousticness' , value: d.acousticness},
				{name: 'acousticness' , value: targetValues.acousticness * 100},
				{name: 'danceability' , value: d.danceability},
				{name: 'danceability' , value: targetValues.danceability * 100 },
				{name: 'energy' , value: d.energy},
				{name: 'energy' , value: targetValues.energy * 100 },
				{name: 'instrumentalness' , value: d.instrumentalness},
				{name: 'instrumentalness' , value: targetValues.instrumentalness * 100 },
				{name: 'tempo' , value: d.tempo},
				{name: 'tempo' , value: Math.round((targetValues.tempo - 40)/1.6) },
				{name: 'valence' , value: d.valence},
				{name: 'valence' , value: targetValues.valence * 100},
			];
			var dataSong = [
				{name: 'acousticness' , value: d.acousticness},
				{name: 'danceability' , value: d.danceability},
				{name: 'energy' , value: d.energy},
				{name: 'instrumentalness' , value: d.instrumentalness},
				{name: 'tempo' , value: d.tempo},
				{name: 'valence' , value: d.valence}
			];

			if($.cookie('visual') === "true"){
				makeGroupedBarchart(groupedDataSong, d.trackId, 550,300, "popUpSvg_");
				if($.cookie('miniBarchart') === "true"){
					$('.showPopUp').css('display', 'none');
					makeMiniBarchart(dataSong, d.trackId, 60,60);
				}
				else{
					$('.miniBarChart').css('display', 'none');
				}
			}
			else{
				if( $.cookie('baseline') === 'true'){
					$('.popUp').css('display', 'none')
					$('.showPopUp').css('display', 'none');
					$('.miniBarChart').css('display', 'none');
					$('.titleLinkDiv').css('width','450px');
				}
				else{
					$('.popUpSvg').css('display', 'none');
					$('.miniBarChart').css('display', 'none');
					makeVerbalExplanation(groupedDataSong, d.trackId)
				}

			}

			//todo verklaring waarom dit nodig is
			// $('#'+ d.trackId).attr('dataset', dataSong);

		}
	});
}

/**
 * Put the song in the list of disliked songs
 *
 * @param button
 * @param trackId
 */
function dislikeSong(button, trackId) {
	//style the div
	$('#' + trackId).removeClass('liked');
	//style the buttons
	button
		.removeClass("fa-thumbs-o-down")
		.addClass("fa-thumbs-down")
		.css("color","red");
	var likeButton = $('#thumbUp_' + trackId)
	likeButton
		.removeClass("fa-thumbs-up")
		.addClass("fa-thumbs-o-up")
	;

	//You click dislike for the first time
	//(don' put the same song twice in the list)
	if(dislikedSongs.indexOf(trackId) === -1){
		dislikedSongs.push(trackId);
	}

	//If you liked this song:
	//remove from list
	//remove the next button if needed
	var index = likedSongs.indexOf(trackId);
	if( index !== -1){
		likedSongs.splice(index,1)
		if(likedSongs.length < 5){
			$('#button_Home').css('display', 'none')
		}
	}


}

function likeSong(button, trackId ) {
	//style the div
	$('#' + trackId).addClass('liked');

	//style the buttons
	button
		.removeClass("fa-thumbs-o-up")
		.addClass("fa-thumbs-up")
	;
	var dislikeButton = $('#thumbDown_' + trackId);
	dislikeButton
		.removeClass("fa-thumbs-down")
		.addClass("fa-thumbs-o-down")
		.css("color","#29a747")
	;

	//Put the song only once in list
	if(likedSongs.indexOf(trackId) === -1){
		likedSongs.push(trackId);
	}
	//Check if you need to display the next button
	if (likedSongs.length >= 5){
		$('#button_Home').css('display', 'flex')
	}

	//If you disliked this song:
	//remove from list
	//remove the next button if needed
	var index = dislikedSongs.indexOf(trackId);
	if( index !== -1){
		dislikedSongs.splice(index,1)
	}
}

function addToPlaylist(id){
	$('#playlist').append($('#' + id))
}

//show the correct artists tab
function showArtistTab(artistId) {
	//style tabs
	$('.tablinks').removeClass('active');
	$('#tab_' + artistId).addClass('active');

	if(artistId==='All'){
		$('.tabContent').css('display', 'block');
	}
	else{
		//show/hide content
		$('.tabContent').css('display', 'none');
		$('#recList_' + artistId).css('display', 'block')
	}
}

//show the correct data in the scatterplot
function showScatterplot(artistId) {
	if ( artistId === 'All'){
		$('.shape').removeClass('invisible');
		$('.hoverShape').removeClass('invisible');

	}
	else{
		var activeSymbol = getArtistShape(artistId);
		$('.shape').addClass('invisible');
		$('.hoverShape').addClass('invisible');

		$('.' + activeSymbol). removeClass('invisible');
	}
}

function removeTab(artistId){
	var tab = $('#tab_' + artistId);
	if (tab.hasClass('active')){
		console.log('remove active class')
		showArtistTab('All');
		showScatterplot('All');
	}
	tab.remove()
}

function makeVerbalExplanation(groupedDataSong, trackId) {
	Handlebars.registerHelper("getIntegerValue", function(value) {
		return parseInt(value)
	});

	Handlebars.registerHelper("getAttributeColor", function(attribute) {
		return getAttributeColor(attribute)
	});

	var reformattedData = []
	for ( var i = 0; i <groupedDataSong.length ; i++){
		if(i % 2 === 0){
			var tmpData = groupedDataSong[i]
			tmpData['valueSlider'] = groupedDataSong[i+1]['value']
			reformattedData.push(tmpData)
		}
	}


	var template = Handlebars.templates['verbalExplanation'];
	reformattedData.forEach(function (d) {
		var html = template(d);
		$('#verbalExplContainer_' + trackId).append(html)
	})
}



