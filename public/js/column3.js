var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

	$(document).on('click', ".calculateButton", function() {
		if(selectedArtists.length > 0){
			$('.warningSelect').css("display", "none");
			var myNode = document.getElementById("recList");
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
			}
			getRecommendations()
			$('.calculateButton').css("display", "none");
			$('#refreshButton').css("display", "inline-block");
		}
		else{
			$('.warningSelect').css("display", "block")
		}

	});

	$(document).on('click', "#refreshButton", function() {
		if(selectedArtists.length > 0){
			$('.warningSelect').css("display", "none");
			var myNode = document.getElementById("recList");
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
			}
			getRecommendations()
			$('.calculateButton').css("display", "none");
			$('#refreshButton').css("display", "inline-block");
		}
		else{
			$('.warningSelect').css("display", "block")
		}

	});

});


function getRecommendations() {
	var queryBase = '/getRec?token=' + spotifyToken + '&limit=5&artists=' + selectedArtists;
	var queryTrackAtrributes = '&target_acousticness=' + acousticness + '&target_danceability=' + danceability
		+ '&target_energy=' + energy + '&target_valence=' + valence + '&target_popularity='+popularity;
	var query = queryBase.concat(queryTrackAtrributes);
	// jQuery AJAX call for JSON
	$.getJSON( query , function( data ) {
		console.log(data)
		data.forEach(function (d) {
			var track = d.name;
			var artist = d.artists[0].name;
			$( "#recList" ).append('<div class="recDiv" id="' + d.id + '"></div>');
			$( "#" + d.id + "" ).append('<div class="recDivTrack" id="track' + d.id + '">' + track  + '</div>')
			$( "#" + d.id + "" ).append('<div class="recDivArtist" id="' + d.id + '">' + artist  + '</div>')

		})
	});

}