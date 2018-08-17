// DOM Ready =============================================================
$(document).ready(function() {
	var task =
		'Please ' +
		'<span class="taskSpan">explore</span> ' +
		'the recommendations <br>' +
		'and like ' +
		'<span class="taskSpan">15 songs</span>';
	if(fun === 'true' ){
		task += ' you like to listen during a <span class="taskSpan">fun</span> activity.'
	}
	else{
		task += ' you like to listen for <span class="taskSpan">relaxing</span>.'
	}
	$('#task').html( task)


	$( document ).tooltip();

	$(document).on('click', ".playButton", function(event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr("id");
		var trackId = buttonId.split("_")[1];
		//Do not change to jquery, then it stops working
		var audioId = "trackAudio_" + trackId;
		var audio = document.getElementById(audioId);
		var grandParent = button.parent().parent().attr('class')
		//return to play button on ended
		$("#"+audioId).bind("ended", function(){
			button
				.removeClass("fas fa-pause-circle")
				.addClass("fa fa-play-circle");
		});
		if(audio.paused){
			addInteraction('playButton_' + grandParent, 'play', trackId);
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
			addInteraction('playButton_' + grandParent, 'stop', trackId);
			stopMusic(trackId, button)
		}
	});

	$(document).on('click', '.thumbDown', function (event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		dislikeSong(button, trackId);
		updateNbRatedList()
	});

	$(document).on('click', '.thumbUp', function (event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		likeSong(button, trackId);
		updateNbRatedList()

	});

	$(document).on('click', '.showPopUp', function () {
		if($.cookie('baseline') != 'true'){
			var trackId = this.id.split('_')[1];
			var popUp = $('#popUp_' + trackId);
			var showPopUpButton = $('#showPopUp_' + trackId);
			var songLink = $('#songLink_' + trackId);
			if ($('#permanent_' + trackId).hasClass('selectedRecommendation')){
				$('#permanent_' + trackId).removeClass('selectedRecommendation');
				songLink.removeClass('selectedRecommendation');
				showPopUpButton.removeClass('selectedShowPopUp');
				popUp.slideUp(500);
				// popUp.addClass('hidden');
				addInteraction('showPopUp', 'close', trackId);

			}
			else{
				$('#permanent_' + trackId).addClass('selectedRecommendation');
				songLink.addClass('selectedRecommendation');
				// popUp.removeClass('hidden')
				popUp.slideDown(500);

				showPopUpButton.addClass('selectedShowPopUp')
				addInteraction('showPopUp', 'open', trackId);
			}

		}
	});

	$(document).on('mouseenter','.permanent',function () {
		var trackId = this.id.split('_')[1];
		// addInteraction('permanent', 'hover', trackId);

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
		activeArtist = artistId;
	})

	$(document).on('click','.showScatterplot',function () {
		$('#scatterplotContainer')
			.toggle('slow', 'swing')
			.toggleClass('show');
		var popUpId = $(this).parent().parent().attr('id')
		var trackId = popUpId.split('_')[1]
		var action = 'show';
		$('.showScatterplot').text(function(i, text){
			if(text==="More"){
				return "Hide";
			}
			else{
				action = 'hide';
				return "More";
			}
		})
		addInteraction('showScatterplot', action, trackId);

	})

});

function stopMusic(trackId, button) {
	var audioId = "trackAudio_" + trackId;
	//Do not change to jquery, then it stops working
	var audio = document.getElementById(audioId);
	audio.pause();

	button
		.removeClass("fas fa-pause-circle")
		.addClass("fa fa-play-circle");
}

function appendToRatedSongList(trackId, liked){
	//stop the music
	var button = $('#trackButton_' + trackId)
	stopMusic(trackId, button)
	var appendToId = '_clone';
	if(liked){
		appendToId = '_cloneLiked'
	}
	else{
		appendToId = '_cloneDisliked'
	}
	var clone = $('#' + trackId).clone();
	var cloneId = clone.attr('id');
	clone
		.attr('id', cloneId + appendToId);

	var children = clone.find('*');
	for (var i=0; i < children.length; i++){
		var child = $(children[i]);
		//don't show popUp
		if (child.hasClass('popUp')){
			child.css('display', 'none')
		}
		if(child.hasClass('fa-pause-circle')){
			child
				.removeClass("fas fa-pause-circle")
				.addClass("fa fa-play-circle");
		}

		var currentId = child.attr('id')
		child.attr('id', currentId + appendToId);
		child.removeClass('selectedRecommendation')
	}
	if(liked){
		clone.appendTo('#likedSongsList')
	}
	else {
		clone.appendTo('#dislikedSongsList')
	}

}

function updateNbRatedList() {
	$('#nbLiked').html(likedSongs.length);
	$('#nbDisliked').html(dislikedSongs.length);

}

function removeUnlikedSongs(similarArtist) {
	var oldSongs = $('#recList_' + similarArtist).children();
	for(var i = 0; i<oldSongs.length; i++){
		var liked = $(oldSongs[i]).hasClass('liked');
		if(!liked){
			$(oldSongs[i]).remove()
		}
	}

}

function updateRecommendations(recommendations, similarArtist, activeArtist){
	$('#warningNoRecommendations').css('display','none')
	showScatterplot(activeArtist);
	removeUnlikedSongs(similarArtist);
	Handlebars.registerHelper("getShowScatterplotText", function() {
		var display = $('#scatterplotContainer').hasClass('show');
		if(display){
			return 'Hide'
		}
		else{
			return 'More'
		}
	});

	var template = Handlebars.templates['recommendation'];
	recommendations.forEach(function (d,i) {
		if(d.similarArtist === similarArtist){
			var html = template(d);
			$("#recList_" + d.similarArtist ).append(html);
			if(i < nbOfRecommendations){
				$('#' + d.trackId).addClass('active');
				allRecommendations.push(d.trackId)
			}
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

			if($.cookie('baseline') === 'true'){
				$('.popUp').css('display', 'none');
				$('.showPopUp').css('display', 'none');
				$('.miniBarChart').css('display', 'none');
				$('.titleLinkDiv').css('width','450px');
			}
			else{
				if($.cookie('explanations') === "true") {
					makeGroupedBarchart(groupedDataSong, d.trackId, 550, 300, "popUpSvg_");
					$('.miniBarChart').css('display', 'none');
				}
				else{
						$('.popUpSvg').css('display', 'none');
						$('.miniBarChart').css('display', 'none');
						makeVerbalExplanation(groupedDataSong, d.trackId)
				}
			}
		}
	});
	setTimeout(enableAllInput(), 1000)

}

/**
 * Put the song in the list of disliked songs
 *
 * @param button
 * @param trackId
 */
function dislikeSong(button, trackId) {
	$('#shape_' + trackId).remove();
	//style the div
	$('#' + trackId)
		.removeClass('liked')
		.addClass('disliked');
	//style the buttons
	button
		.removeClass("fa-thumbs-o-down")
		.addClass("fa-thumbs-down")
		.css("color","red");
	var likeButton = $('#thumbUp_' + trackId);
	likeButton
		.removeClass("fa-thumbs-up")
		.addClass("fa-thumbs-o-up")
		.css('color', '#29a747')
	;

	//You click dislike for the first time
	//(don' put the same song twice in the list)
	if(dislikedSongs.indexOf(trackId) === -1){
		dislikedSongs.push(trackId);
		//	append to list
		appendToRatedSongList(trackId, false)
		addInteraction('thumbDown', 'click', trackId);
	}

	//If you liked this song:
	//remove from list
	//remove the next button if needed
	var index = likedSongs.indexOf(trackId);
	if( index !== -1){
		likedSongs.splice(index,1)
		if(likedSongs.length < nbOfTaskSongs){
			$('#button_Home').css('display', 'none')
		}
	}

	//Remove from the liked list
	$('#' + trackId + '_cloneLiked' ).remove()


	//remove song from recommendations
	$( '#' + trackId ).animate({
		opacity: 0.25,
		left: "+=50",
		height: "toggle"
	}, 1000, function() {
		// Animation complete.
		$('#' + trackId).css('display', 'none');
		//show another song
		var nextRecommendation =
			$('#recList').find('.recommendation:not(.active)').first();

		if(nextRecommendation.length != 0){
			var newTrackId = nextRecommendation.attr('id')
			$('#shape_' + newTrackId).removeClass('invisible');
			nextRecommendation
				.css('display', 'flex')
				.addClass('active')
		}
		else{
			$('#warningNoRecommendations').css('display','block')
		}
	});

}

function likeSong(button, trackId ) {
	$('#shape_' + trackId).addClass('liked');
	//style the div
	$('#' + trackId)
		.removeClass('disliked')
		.addClass('liked');

	//style the buttons
	button
		.removeClass("fa-thumbs-o-up")
		.addClass("fa-thumbs-up")
		.css('color', '#05ff40')
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
		appendToRatedSongList(trackId, true)
		addInteraction('thumbUp', 'click', trackId);
	}
	//Check if you need to display the next button
	if (likedSongs.length >= nbOfTaskSongs){
		$('#button_Home').css('display', 'inline-block')
	}

	//If you disliked this song:
	//remove from list
	//remove the next button if needed
	var index = dislikedSongs.indexOf(trackId);
	if( index !== -1){
		dislikedSongs.splice(index,1)
	}

	//Remove from the disliked list
	$('#' + trackId + '_cloneDisliked' ).remove()
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

		$('.' + activeSymbol).removeClass('invisible');
	}
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



