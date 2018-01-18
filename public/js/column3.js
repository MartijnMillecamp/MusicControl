var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
	getRecommendations();

});


function getRecommendations() {

	// jQuery AJAX call for JSON
	$.getJSON( '/getSimpleRecom?token=' + spotifyToken  , function( data ) {

		data.forEach(function (d) {

			$( "#rec" ).append('<div class="recDiv">' + d.name+ '</div>')
		})
	});
};