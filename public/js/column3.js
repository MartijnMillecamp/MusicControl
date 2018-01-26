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
			var myNode = document.getElementById("recList");
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
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
		audioId = "trackAudio" + trackId;
		var audio = document.getElementById(audioId);
		$("#"+audioId).bind("ended", function(){
			button
				.removeClass("fa fa-pause-circle-o")
				.addClass("fa fa-play-circle-o");
		});
		if(audio.paused){
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


});


function getRecommendations() {
	//todo use template/handlebars to append
	var queryBase = '/getRec?token=' + spotifyToken + '&limit=9&artists=' + selectedArtists;
	var queryTrackAtrributes = '&target_acousticness=' + acousticness + '&target_danceability=' + danceability
		+ '&target_energy=' + energy + '&target_valence=' + valence + '&target_popularity='+popularity;
	var query = queryBase.concat(queryTrackAtrributes);
	// jQuery AJAX call for JSON
	$.getJSON( query , function( data ) {
		data.forEach(function (d) {
			console.log(d.preview_url === null)
			console.log(d.preview_url)
			var track = d.name;
			var artist = d.artists[0].name;
			var preview =  d.preview_url;

			var trackButton = '<button class="trackButton fa fa-play-circle-o" id="trackButton_' + d.id + '"   style="font-size:60px"' +
				'      ></button>';
			if ( preview === null){
				trackButton = '<button class="disabledButton fa fa-ban" id="trackButton_' + d.id + '"   style="font-size:60px"' +
					'      ></button>';
			}

			var buttonDiv = '<div class="buttonDiv" id="buttonDiv_' + d.id + '"  ></div>';
			var thumbsDown = '<button class="thumbDown fa fa-thumbs-down" id="thumbDown_' + d.id + '"   style="font-size:60px"' +
				'      ></button>';
			var thumbsUp = '<button class="thumbUp fa fa-thumbs-up" id="thumbUp_' + d.id + '"   style="font-size:60px"' +
				'      ></button>';
			var trackAudio = '<audio id="trackAudio' + d.id + '"  ><source src="' + preview + '"><source></audio>';
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


		})
	});
	setTimeout('$("#calculateButton").removeAttr("disabled")', 1500);

}

function getTrack(id){
	var query = '/getTrackPreview?token=' + spotifyToken + '&trackId=' + id;
	$.getJSON(query, function (data) {
		console.log(data)
	})
}
