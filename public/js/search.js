var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');



console.log( 'load search.js')

$('#search').keypress(function (e) {
	if (e.which == 13) {
		var query = $('#search').val();
		console.log('search ' + query)
		searchArtist(query)
	}
});


function searchArtist(query) {
	var query = '/searchArtist?token=' + spotifyToken + '&q=' + query + '&limit=' + 3;
	$.getJSON(query, function (data) {
		console.log(data);
		data.forEach(function (d) {
			console.log(d.name+ ':' + d)
		})
	})
}

