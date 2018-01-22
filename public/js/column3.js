var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
	//slider
	var slider = document.getElementById("myRange");
	console.log(slider.value)
	var output = document.getElementById("sliderValue");
	output.innerHTML = "Number of Songs: " + slider.value; // Display the default slider value
	numberOfSongs = slider.value;

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
		output.innerHTML = "Number of Songs: " + this.value;
		numberOfSongs = this.value;
	};

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
		var buttonId = $(this).attr("id");
		var trackId = buttonId.split("_").pop();
		audioId = "trackAudio" + trackId;
		var audio = document.getElementById(audioId);
		if(audio.paused){
			audio.play()
			$(this)
				.removeClass("fa fa-play-circle-o")
				.addClass("fa fa-pause-circle-o");
		}
		else{
			audio.pause()
			$(this)
				.removeClass("fa fa-pause-circle-o")
				.addClass("fa fa-play-circle-o");
		}


	});


});


function getRecommendations() {
	var queryBase = '/getRec?token=' + spotifyToken + '&limit=' + numberOfSongs + '&artists=' + selectedArtists;
	var queryTrackAtrributes = '&target_acousticness=' + acousticness + '&target_danceability=' + danceability
		+ '&target_energy=' + energy + '&target_valence=' + valence + '&target_popularity='+popularity;
	var query = queryBase.concat(queryTrackAtrributes);
	// jQuery AJAX call for JSON
	$.getJSON( query , function( data ) {
		data.forEach(function (d) {
			var track = d.name;
			var artist = d.artists[0].name;
			var preview =  d.preview_url;

			var buttonDiv = '<div class="buttonDiv" id="buttonDiv_' + d.id + '"  ></div>';
			var trackButton = '<button class="trackButton fa fa-play-circle-o" id="trackButton_' + d.id + '"   style="font-size:60px"' +
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
				.append(trackButton)
				.append(trackAudio);


		})
	});
	setTimeout('$("#calculateButton").removeAttr("disabled")', 1500);

}
