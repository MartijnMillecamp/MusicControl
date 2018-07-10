
// DOM Ready =============================================================
$(document).ready(function() {
	updateProfile(dislikedSongs, 'dislikedSongs');
	updateProfile(likedSongs, 'likedSongs');
	updateProfile(clickedSongs, 'clickedSongs');
	updateProfile(playedSongs, 'playedSongs');

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
			// addRecord('trackButton', 'click', 0);
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
		var songLink = $('#songLink_' + trackId)
		if ($(this).hasClass('selectedRecommendation')){
			$(this).removeClass('selectedRecommendation');
			songLink.removeClass('selectedRecommendation');
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
});

function updateRecommendations(recommendations, similarArtist){
	//if you update a tab, select that tab
	if(similarArtist !== null){
		showArtistTab(similarArtist);
		showScatterplot(similarArtist);
	}
	Handlebars.registerHelper("getArtistColorHelper", function(similarArtist) {
		return getArtistColor(similarArtist)
	});

	Handlebars.registerHelper("getSimilarArtistImage", function(similarArtistId) {
		var similarArtistDiv = $('#' + similarArtistId + '_image').attr('src');
		console.log(similarArtistDiv)
		return similarArtistDiv
	});

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
			makeGroupedBarchart(groupedDataSong, d.trackId, 550,300, "popUpSvg_");
			var dataSong = [
				{name: 'acousticness' , value: d.acousticness},
				{name: 'danceability' , value: d.danceability},
				{name: 'energy' , value: d.energy},
				{name: 'instrumentalness' , value: d.instrumentalness},
				{name: 'tempo' , value: d.tempo},
				{name: 'valence' , value: d.valence},
			];
			makeMiniBarchart(dataSong, d.trackId, 60,60);
			$('#'+ d.trackId).attr('dataset', dataSong);

		}
	});
}

function dislikeSong(button, id, recDiv) {
	if(dislikedSongs.indexOf(id) === -1){
		dislikedSongs.push(id);
		//todo
		// audioId = "trackAudio" + id;
		// var audio = document.getElementById(audioId);
		// audio.pause();

		button
			.removeClass("fa-thumbs-o-down")
			.addClass("fa-thumbs-down")
			.css("color","red");
		updateProfile(dislikedSongs, 'dislikedSongs')

	}


}

function likeSong(button, trackId ) {
	likedSongs.push(trackId);
	button
		.removeClass("fa-thumbs-o-up")
		.addClass("fa-thumbs-up")
	;
	updateProfile(likedSongs, 'likedSongs')
}

function addToPlaylist(id){
	$('#playlist').append($('#' + id))
}

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



