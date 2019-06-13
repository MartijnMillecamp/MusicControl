// DOM Ready =============================================================
$(document).ready(function() {
	var task =
		'Please ' +
		'<span class="taskSpan">explore</span> ' +
		'the recommendations <br>' +
		'and like ' +
		'<span class="taskSpan">5 songs</span>';
	
	if(fun === 'true' ){
		task += ' you like to listen during a <span class="taskSpan">fun</span> activity.'
	}
	else{
		task += ' you like to listen for <span class="taskSpan">relaxing</span>.'
	}
	$('#task').html( task);
	
	$(document).on('mouseenter', ".recImage", function () {
		if (playable === 'true'){
      var id = $(this).attr('id').split("_")[1];
      var image = $("#image_" + id);
      var playButton = $('#trackButton_' + id);
      image.addClass("background");
      playButton.addClass("active")
		}
  
      
	});
	
  $(document) .on('mouseleave', ".recImage", function () {
    if (playable === 'true') {
      var id = $(this).attr('id').split("_")[1];
      var image = $("#image_" + id);
      var playButton = $('#trackButton_' + id);
  
  
      if (!playButton.hasClass("fa-pause-circle")) {
        image.removeClass("background");
        playButton.removeClass('active');
      }
    }
     
     
  });


	// $( document ).tooltip();
	
	$(document).on('click', ".playButton", function(event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr("id");
		var trackId = buttonId.split("_")[1];
		//Do not change to jquery, then it stops working
		var audioId = "trackAudio_" + trackId;
		var audio = document.getElementById(audioId);
		var grandParent = button.parent().parent().attr('class');
		var image = $("#image_" + trackId);
		//return to play button on ended
		$("#"+audioId).bind("ended", function(){
			button
				.removeClass("fas fa-pause-circle")
				.addClass("fa fa-play-circle");
		});
		if(audio.paused){
			addInteraction('playSong_' + grandParent, 'play', trackId);
			//stop all audio
			var sounds = document.getElementsByTagName('audio');
			for(var i=0; i<sounds.length; i++) sounds[i].pause();
			
			//change all buttons to default
			var trackbuttons = $('.playButton');
			for(var j=0; j<trackbuttons.length; j++) {
				$(trackbuttons[j])
					.removeClass("fas fa-pause-circle")
					.addClass("fa fa-play-circle")
					.removeClass("active");
			}
			audio.play();
			//make current button active
			button
				.removeClass("fa fa-play-circle")
				.addClass("fas fa-pause-circle")
				.addClass("active");
			
			//change all images to default
			var trackImages = $(".trackImage");
      for(var k=0; k<trackImages.length; k++) {
      	var currentImage = $(trackImages[k]);
      	if (currentImage.attr('id') !== image.attr('id')){
      		currentImage.removeClass('background')
	      }
      }
			
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
		updateNbRatedList();
  
  });

	$(document).on('click', '.thumbUp', function (event) {
		event.stopPropagation();
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		likeSong(button, trackId);
		updateNbRatedList()

	});
	




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
	stopMusic(trackId, button);
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
		.attr('id', cloneId + appendToId)
		.addClass('clone');
	
	var children = clone.find('*');
	for (var i=0; i < children.length; i++){
		var child = $(children[i]);
		child.addClass("clone");
		
		// if (child.hasClass('recBars')){
		//
		// }
		

		var currentId = child.attr('id');
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

/**
 * Create a list of recommendations
 * @param recommendations
 * @param similarArtist
 * @param activeArtist
 *
 */
function updateRecommendations(recommendations, similarArtist, activeArtist){
  currentRecommendations[similarArtist] = Array.from(recommendations);
	if(recommendations.length === 0){
    $('#warningNoRecommendations').css('display','block');
  }
  else{
    $('#warningNoRecommendations').css('display','none');
	}
	// showScatterplot(activeArtist);
	removeUnlikedSongs(similarArtist);
	
  recommendationIdList = [];
  var template = Handlebars.templates['recommendation'];
	recommendations.forEach(function (d,i) {
		recommendationIdList.push(d.trackId);
    var html = template(d);
		$("#recList_" + similarArtist ).append(html);
		if(i < nbOfRecommendations){
			$('#' + d.trackId).addClass('active');
			allRecommendations.push(d.trackId)
			//like previously liked songs
			if (likedSongs.indexOf(d.trackId) !== -1){
        $('#thumbUp_' + d.trackId)
          .removeClass("fa-thumbs-o-up")
          .addClass("fa-thumbs-up")
          .css('color', '#05ff40')
        ;
			}
			//dislike previously disliked songs
      if (dislikedSongs.indexOf(d.trackId) !== -1){
        $('#thumbDown_' + d.trackId)
          .removeClass("fa-thumbs-o-down")
          .addClass("fa-thumbs-down")
          .css("color","red");
        ;
      }
		}
		var groupedDataSongAll = [
			{name: 'acousticness' , min: targetValues.min_acousticness, max: targetValues.max_acousticness,  value: d.acousticness},
			{name: 'danceability' , min: targetValues.min_danceability, max: targetValues.max_danceability,  value: d.danceability},
			{name: 'duration' , min: targetValues.min_duration, max: targetValues.max_duration,  value: d.duration},
			{name: 'energy' , min: targetValues.min_energy, max: targetValues.max_energy,  value: d.energy},
			{name: 'instrumentalness' , min: targetValues.min_instrumentalness, max: targetValues.max_instrumentalness,  value: d.instrumentalness},
			{name: 'liveness' , min: targetValues.min_liveness, max: targetValues.max_liveness,  value: d.liveness},
			{name: 'loudness' , min: targetValues.min_loudness, max: targetValues.max_loudness,  value: d.loudness},
			{name: 'popularity' , min: targetValues.min_popularity, max: targetValues.max_popularity,  value: d.popularity},
			{name: 'speechiness' , min: targetValues.min_speechiness, max: targetValues.max_speechiness,  value: d.speechiness},
			{name: 'tempo' , min: targetValues.min_tempo, max: targetValues.max_tempo,  value: d.tempo},
			{name: 'valence' , min: targetValues.min_valence, max: targetValues.max_valence,  value: d.valence}
		];

		var groupedDataSong = [];
		selectedSliders.forEach(function (slider) {
			groupedDataSongAll.forEach(function (d) {
				if (d.name === slider){
					groupedDataSong.push(d)
				}
			})
		})
    
    
    makeRangeBarchart2(groupedDataSong, d.trackId, 300, 110, "rec_");

	});
  addInteraction("recommendation", "rec", recommendationIdList);
  
  setTimeout(enableAllInput(), 1000)

}

/**
 * Put the song in the list of disliked songs
 *
 * @param button
 * @param trackId
 */
function dislikeSong(button, trackId) {
	if (button.hasClass("fa-thumbs-down")){
    addInteraction('dislike_undo', 'click', trackId);
    button
      .removeClass("fa-thumbs-down")
      .addClass("fa-thumbs-o-down")
      .css("color","#ff4848");
    
    //If you disliked this song:
    //remove from list
    //remove the next button if needed
    var index = dislikedSongs.indexOf(trackId);
    if( index !== -1){
      dislikedSongs.splice(index,1)
    }
    
    //Remove from the liked list
    $('#' + trackId + '_cloneDisliked' ).remove()
		
	}
	else{
    addInteraction('dislike', 'click', trackId);
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
	}
	
	
	

	

}




function likeSong(button, trackId ) {
	if (button.hasClass("fa-thumbs-up")){
    addInteraction('like_undo', 'click', trackId);
    //style the buttons
    button
      .removeClass("fa-thumbs-up")
      .addClass("fa-thumbs-o-up")
      .css('color', '#29a747')
    ;
    
    //If you liked this song:
    //remove from list
    //remove the next button if needed
    var index = likedSongs.indexOf(trackId);
    if( index !== -1){
      likedSongs.splice(index,1)
    }
    $('#' + trackId + '_cloneLiked' ).remove()
    
    
  }
	else{
    addInteraction('like', 'click', trackId);
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
      .css("color","#ff4848")
    ;
    
    //Put the song only once in list
    if(likedSongs.indexOf(trackId) === -1){
      likedSongs.push(trackId);
      appendToRatedSongList(trackId, true);
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

	// //style the div
	// $('#' + trackId)
	// 	.removeClass('disliked')
	// 	.addClass('liked');

	

	

	
}





function showScatterplot() {
	var activeSymbol = 'circle';
	$('.shape').addClass('invisible');
	$('.hoverShape').addClass('invisible');
	$('.' + activeSymbol).removeClass('invisible');
}




