var interfaceNb = parseInt($.cookie('first'));
// DOM Ready =============================================================
$(document).ready(function() {
	if (interfaceNb ===0){
		$('#task').text("Task: Make a playlist of 9 songs to listen to when traveling (e.g. commuting, etc.).")
	}
	else{
		$('#task').text("Task: Make a playlist of 9 songs to listen to during your personal maintenance.")
	}

	$(document).on('click', "#calculateButton", function(event) {
		flashButton(false);
		$(this).attr("disabled", "disabled");
		if(selectedArtists.length > 0){
			addRecord('calculateButton', 'click', 1);
			//ripple effect
			event.preventDefault();

			var $div = $('<div/>'),
				btnOffset = $(this).offset(),
				xPos = event.pageX - btnOffset.left,
				yPos = event.pageY - btnOffset.top;

			$div.addClass('ripple-effect');
			var $ripple = $(".ripple-effect");

			$ripple.css("height", $(this).height());
			$ripple.css("width", $(this).height());
			$div
				.css({
					top: yPos - ($ripple.height()/2),
					left: xPos - ($ripple.width()/2),
					background: $(this).data("ripple-color")
				})
				.appendTo($(this));

			window.setTimeout(function(){
				$div.remove();
			}, 1000);

			//
			$('.warningSelect').css("display", "none");
			var notSelected = $('.recDiv').not('.selected');
			for (var i = 0, len = notSelected.length; i < len; i++) {
				notSelected[i].remove()
			}

			getRecommendations();
			$('#moresongs').css('display', 'inline-block')

		}
		else{
			addRecord('calculateButton', 'click', interfaceNb);
			$('.warningSelect').css("display", "block");
			$("#calculateButton").removeAttr("disabled");

		}


	});

	$(document).on('click', ".trackButton", function() {
		var button = $(this);
		var buttonId = button.attr("id");
		var trackId = buttonId.split("_").pop();
		var audioId = "trackAudio" + trackId;
		var audio = document.getElementById(audioId);
		//return to play button on ended
		$("#"+audioId).bind("ended", function(){
			button
				.removeClass("fa fa-pause-circle-o")
				.addClass("fa fa-play-circle-o");
		});
		if(audio.paused){
			addRecord('trackButton', 'click', 1);
			//stop all audio
			var sounds = document.getElementsByTagName('audio');
			for(var i=0; i<sounds.length; i++) sounds[i].pause();
			var trackbuttons = $('.trackButton');
			for(var j=0; j<trackbuttons.length; j++) {
				$(trackbuttons[j])
					.removeClass("fa fa-pause-circle-o")
					.addClass("fa fa-play-circle-o");
			}
			audio.play();
			button
				.removeClass("fa fa-play-circle-o")
				.addClass("fa fa-pause-circle-o");
		}
		else{
			addRecord('trackButton', 'click', 0);
			audio.pause();
			button
				.removeClass("fa fa-pause-circle-o")
				.addClass("fa fa-play-circle-o");
		}
	});

	$(document).on('click', '.thumbDown', function () {
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		var recDiv = $('#' + trackId);
		addRecord('thumbDown', 'click', trackId);
		dislikeSong(button, trackId, recDiv);
	});

	$(document).on('click', '.thumbUp', function () {
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		var recDiv = $('#' + trackId);
		console.log(trackId)
		addRecord('thumbUp', 'click', trackId);
		likeSong(button, trackId, recDiv);
	});

	$(document).on('click', '#saveButton', function () {
		addRecord('saveButton', 'click', interfaceNb);
		if(interfaceNb === 0){
			window.location.href = '/saveRecommendations?interface=1';
		}
		else{
			window.location.href = '/saveRecommendations?interface=2';
		}

	});
	$(document).on('click', '#question', function () {
		if($('#moreInfo').css('display') === 'none'){
			addRecord('question', 'click', 1);
			$('#moreInfo').css('display', 'block')
		}
		else{
			addRecord('question', 'click', 0);
			$('#moreInfo').css('display', 'none')
		}
	});

});


function getRecommendations() {
	//todo use template/handlebars to append
	var limit = likedSongs.length + dislikedSongs.length + 15;
	var queryBase = base + '/getRec?token=' +spotifyToken + '&limit=' + limit + '&artists=' + selectedArtists;
	var queryBase2 = base + '/addRecommendation?&userName=' + userName ;

	var queryTrackAtrributes = '&target_acousticness=' + targetValues.acousticness + '&target_danceability=' + targetValues.danceability
		+ '&target_energy=' + targetValues.energy + '&target_valence=' + targetValues.valence + '&target_instrumentalness='+targetValues.instrumentalness
		+'&userId=' + userID + '&likedSongs=' + likedSongs.length + '&dislikedSongs=' + dislikedSongs.length;
	var query = queryBase.concat(queryTrackAtrributes);
	// jQuery AJAX call for JSON
	$.getJSON( query , function( data ) {
		var nbRecommendations = likedSongs.length;
		var shuffled = shuffle(data);
		for(var i=0, len = data.length; i<len; i++){
			var d = shuffled[i];
			var liked = $.inArray(d.id, likedSongs);
			var disliked = $.inArray(d.id, dislikedSongs);

			if (liked === -1 && disliked === -1 && nbRecommendations<15){
				appendRecDiv(d);
				nbRecommendations+=1;
			}

		}
	});
	var query2 = queryBase2 + queryTrackAtrributes;
	$.getJSON( query2 , function( data ) {
		// console.log(data)
	});
	setTimeout('$("#calculateButton").removeAttr("disabled")', 1500);

}

function appendRecDiv(d) {
	var track = d.name;
	var artist = d.artists[0].name;
	var preview =  d.preview_url;

	var trackButton = '<button class="disabledButton fa fa-ban" id="trackButton_' + d.id + '"   style="font-size:60px"' +
		'      ></button>';
	var trackAudio = '<audio id="trackAudio' + d.id + '"  ><source></audio>';

	if ( preview !== null){
		trackButton = '<button class="trackButton fa fa-play-circle-o" id="trackButton_' + d.id + '"   style="font-size:60px"' +
			'      ></button>';
		trackAudio = '<audio id="trackAudio' + d.id + '"  ><source src="' + preview + '"><source></audio>';

	}

	var buttonDiv = '<div class="buttonDiv" id="buttonDiv_' + d.id + '"  ></div>';
	var thumbsDown = '<button class="thumbDown fa fa-thumbs-o-down" id="thumbDown_' + d.id + '"   style="font-size:40px"' +
		'      ></button>';
	var thumbsUp = '<button class="thumbUp fa fa-thumbs-o-up" id="thumbUp_' + d.id + '"   style="font-size:40px"' +
		'      ></button>';
	var recDivInfo = '<div class="recDivInfo" id="info_' + d.id +  '" ></div>';
	var recDivTrack = '<div class="recDivTrack" id="track_' + d.id +  '" >' + track  + '</div>';
	var recDivArtist = '<div class="recDivArtist" id="artist_' + d.id + '">' + artist  + '</div>';

	$( "#recList" )
		.append('<div class="recDiv" id="' + d.id + '"></div>');
	$( "#" + d.id + "" )
		.append(buttonDiv)
		.append(trackAudio)
		.append(recDivInfo);
	$( "#info_" + d.id + "" )
		.append(recDivTrack)
		.append(recDivArtist);
	$( "#buttonDiv_" + d.id + "" )
		.append(thumbsDown)
		.append(trackButton)
		.append(thumbsUp)
		.append(trackAudio);
}

function getTrack(id){
	var query = '/getTrackPreview?token=' + spotifyToken + '&trackId=' + id;
	$.getJSON(query, function (data) {
		console.log(data)
	})
}

function dislikeSong(button, id, recDiv) {
	$('#saveButton').css('display', 'none');
	$('#calculateButton').css('display', 'inline-block');

	//if in likedsongs, remove
	var index = $.inArray(id,likedSongs);
	//You already liked the song
	if (index > -1) {
		var confirmVar = confirm('You really want to dislike this song?');
		if (confirmVar === true){
			//remove it from the likedsongs
			console.log(confirmVar)
			likedSongs.splice(index, 1);
		}
		else{
			return
		}

	}
	dislikedSongs.push(id);
	audioId = "trackAudio" + id;
	var audio = document.getElementById(audioId);
	audio.pause();
	button
		.removeClass("fa-thumbs-o-down")
		.addClass("fa-thumbs-down")
		.css("color","red");
	recDiv.fadeOut("slow");



}

function likeSong(button, id, recDiv) {
	if(likedSongs.length >=9){
		alert('You already have selected 9 songs. Click "Save Recommendations".')
	}
	else{
		likedSongs.push(id);
		button
			.removeClass("fa-thumbs-o-up")
			.addClass("fa-thumbs-up")
			.css("color","#e1a2f8");

		recDiv
			.addClass("selected");

		if(likedSongs.length >= 9){
			$('#calculateButton').css('display', 'none');
			$('#saveButton').css('display', 'inline-block');

		}
	}

}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}



