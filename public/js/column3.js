var interfaceNb = parseInt($.cookie('first'));
// DOM Ready =============================================================
$(document).ready(function() {
	if (interfaceNb ===0){
		$('#task').text("Task: Make a playlist of songs to listen to when traveling (e.g. commuting, etc.).")
	}
	else{
		$('#task').text("Task: Make a playlist of songs to listen to during your personal maintenance.")
	}

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

	$(document).on('click', '.permanent', function () {
		var trackId = this.id.split('_')[1];
		var circle = $('#circle_' + trackId);
		var popUp = $('#popUp_' + trackId);
		if ($(this).hasClass('selectedRecommendation')){
			$(this).removeClass('selectedRecommendation');
			circle.css("r",10)
			circle.css("stroke-width","1px")
			popUp.css('display', 'none')
		}
		else{
			$(this).addClass('selectedRecommendation');
			circle.css("r",20)
			circle.css("stroke-width","10px")
			popUp.css('display', 'block')
		}


	})
});

function updateRecommendations(){
	Handlebars.registerHelper("getArtistColorHelper", function(similarArtist) {
		return getArtistColor(similarArtist)
	});


	$("#recList").html("");
	var template = Handlebars.templates['recommendation'];
	var totalHtml = "";
	recommendedSongs.forEach(function (d) {
		var html = template(d);
		console.log(html)
		totalHtml += html;
	});
	$("#recList").append(totalHtml)
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



