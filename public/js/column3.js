var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

	$(document).on('click', "#calculateButton", function(event) {
		$(this).attr("disabled", "disabled");
		if(selectedArtists.length > 0){

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
		dislikeSong(button, trackId, recDiv);
	})

	$(document).on('click', '.thumbUp', function () {
		var button = $(this);
		var buttonId = button.attr('id');
		var trackId = buttonId.split('_').pop();
		var recDiv = $('#' + trackId);
		likeSong(button, trackId, recDiv);
	})

});


function getRecommendations() {
	//todo use template/handlebars to append
	var limit = likedSongs.length + dislikedSongs.length + 10;
	var queryBase = '/getRec?token=' + spotifyToken + '&limit=20&artists=' + selectedArtists;
	var queryTrackAtrributes = '&target_acousticness=' + acousticness + '&target_danceability=' + danceability
		+ '&target_energy=' + energy + '&target_valence=' + valence + '&target_popularity='+popularity;
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
		data.forEach(function (d) {



		})
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
		.addClass("selected")
}

