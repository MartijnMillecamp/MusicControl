var interfaceNb = parseInt($.cookie('first'));
// DOM Ready =============================================================
$(document).ready(function() {
	if (interfaceNb ===0){
		$('#task').text("Task: Make a playlist of songs to listen to when traveling (e.g. commuting, etc.).")
	}
	else{
		$('#task').text("Task: Make a playlist of songs to listen to during your personal maintenance.")
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

function updateRecommendations(){
	$("#recList").html("")
	var template = Handlebars.templates['recommendation'];
	var totalHtml = "";
	recommendedSongs.forEach(function (d) {
		var html = template(d);
		totalHtml += html;
	});
	$("#recList").append(totalHtml)
}


function appendRecDiv(d) {
	var track = d.name;
	var artist = 'artist';
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



