var interfaceNb = $.cookie('first');
// DOM Ready =============================================================
$(document).ready(function() {
	console.log(interfaceNb);
	console.log(interfaceN)
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
		}
		else{
			addRecord('calculateButton', 'click', 0);
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
		addRecord('thumbDown', 'click', 1);
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		var recDiv = $('#' + trackId);
		dislikeSong(button, trackId, recDiv);
	})

	$(document).on('click', '.thumbUp', function () {
		addRecord('thumbUp', 'click', 1);
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		var recDiv = $('#' + trackId);
		likeSong(button, trackId, recDiv);
	})

	$(document).on('click', '#saveButton', function () {
		addRecord('saveButton', 'click', 1);
		console.log(interfaceNb);
		if(interfaceNb === 1){
			window.location.href = '/saveRecommendations?interface=1';
		}
		else{
			window.location.href = '/saveRecommendations?interface=2';
		}

	})

});


function getRecommendations() {
	//todo use template/handlebars to append
	var limit = likedSongs.length + dislikedSongs.length + 10;
	var queryBase = base + '/getRec?token=' +spotifyToken + '&limit=' + limit + '&artists=' + selectedArtists;
	var queryBase2 = base + '/addRecommendation?&userName=' + userName ;

	var queryTrackAtrributes = '&target_acousticness=' + targetValues.acousticness + '&target_danceability=' + targetValues.danceability
		+ '&target_energy=' + targetValues.energy + '&target_valence=' + targetValues.valence + '&target_instrumentalness='+targetValues.instrumentalness
		+'&userId=' + userID + '&likedSongs=' + likedSongs.length + '&dislikedSongs=' + dislikedSongs.length;
	var query = queryBase.concat(queryTrackAtrributes);
	// jQuery AJAX call for JSON
	$.getJSON( query , function( data ) {
		var nbRecommendations = likedSongs.length;
		for(var i=0, len = data.length; i<len; i++){
			var d = data[i];
			var liked = $.inArray(d.id, likedSongs);
			var disliked = $.inArray(d.id, dislikedSongs);

			if (liked === -1 && disliked === -1 && nbRecommendations<9){
				appendRecDiv(d)
				nbRecommendations+=1;
			}

		}
	});
	var query2 = queryBase2 + queryTrackAtrributes;
	$.getJSON( query2 , function( data ) {
		console.log(data)
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
	if (index > -1) {
		likedSongs.splice(index, 1);
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
	likedSongs.push(id);
	button
		.removeClass("fa-thumbs-o-up")
		.addClass("fa-thumbs-up")
		.css("color","#e1a2f8");

	recDiv
		.addClass("selected");

	if(likedSongs.length === 9){
		$('#calculateButton').css('display', 'none');
		$('#saveButton').css('display', 'inline-block');

	}
}



