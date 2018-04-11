var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');



console.log( 'load search.js')

$('#search').keypress(function (e) {
	if (e.which == 13) {
		var query = $('#search').val()

	}
});


function searchArtist(query) {
	var query = '/searchArtist?userName=' + userName + '&userId=' + userID + '&q=' + query;
	$.getJSON(query, function (data) {
		// console.log(data)
	})
}

