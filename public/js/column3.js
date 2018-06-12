
// DOM Ready =============================================================
$(document).ready(function() {

	$(document).on('click', ".playButton", function() {
		var button = $(this);
		var buttonId = button.attr("id");
		var trackId = buttonId.split("_").pop();
		var audioId = "trackAudio_" + trackId;
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
		var popUp = $('#popUp_' + trackId);
		var songLink = $('#songLink_' + trackId)
		if ($(this).hasClass('selectedRecommendation')){
			$(this).removeClass('selectedRecommendation');
			songLink.removeClass('selectedRecommendation');
			popUp.addClass('hidden')
		}
		else{
			$(this).addClass('selectedRecommendation');
			songLink.addClass('selectedRecommendation');
			popUp.removeClass('hidden')

		}
	});

	$(document).on('mouseenter','.permanent',function () {
		var trackId = this.id.split('_')[1];
		$('#shape_' + trackId).addClass('selected');

		// shape.css('fill', '#3af55c')
	});

	$(document).on('mouseleave','.permanent',function () {
		var trackId = this.id.split('_')[1];
		$('#shape_' + trackId).removeClass('selected');
		// var shape = $('#shape_' + trackId);
		// shape.css('fill', 'none')
	});

	$(document).on('click', '.tablinks', function () {
		var artistId = this.id.split('_')[1];
		showArtistTab(artistId)
	})
});

function updateRecommendations(recommendations, similarArtist){
	//if you update a tab, select that tab
	if(similarArtist !== null){
		showArtistTab(similarArtist)
	}
	Handlebars.registerHelper("getArtistColorHelper", function(similarArtist) {
		return getArtistColor(similarArtist)
	});

	var template = Handlebars.templates['recommendation'];
	recommendations.forEach(function (d) {
		if(d.similarArtist === similarArtist){
			var html = template(d);
			$("#recList_" + d.similarArtist ).append(html)
			var dataSong = [
				{name: 'acousticness' , value: d.acousticness},
				{name: 'danceability' , value: d.danceability},
				{name: 'energy' , value: d.energy},
				{name: 'instrumentalness' , value: d.instrumentalness},
				{name: 'tempo' , value: d.tempo},
				{name: 'valence' , value: d.valence}
			]
			makeBarchart(dataSong, 'popUpSvg_' + d.trackId, 500,300);
			// makeBarchart(dataSong, 'miniHistogramSvg_' + d.trackId, 500,300);

		}
	});
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

function removeTab(artistId){
	var tab = $('#tab_' + artistId);
	if (tab.hasClass('active')){
		showArtistTab('All')
	}
	tab.remove()
}



