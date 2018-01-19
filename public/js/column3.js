var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

	$(document).on('click', ".artistDiv", function() {
		var myNode = document.getElementById("recList");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
		getRecommendations()
	});

});


function getRecommendations() {
	// jQuery AJAX call for JSON
	$.getJSON( '/getSimpleRecom?token=' + spotifyToken + '&limit=5&artists=' + selectedArtists , function( data ) {
		data.forEach(function (d) {
			var track = d.name;
			var artist = d.artists[0].name;
			$( "#recList" ).append('<div class="recDiv" id="' + d.id + '"></div>')
			$( "#" + d.id + "" ).append('<div class="recDivTrack" id="track' + d.id + '">' + track  + '</div>')
			$( "#" + d.id + "" ).append('<div class="recDivArtist" id="' + d.id + '">' + artist  + '</div>')

		})
	});
};