var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userId');
var userName = $.cookie('userName');



$('#search').keypress(function (e) {
	if (e.which == 13) {
		var query = $('#search').val();
		searchArtist(query)
	}
});


function searchArtist(query) {
	var query = '/searchArtist?token=' + spotifyToken + '&q=' + query + '&limit=' + 3;
	$.getJSON(query, function (dataObject) {
		if (dataObject.error){
			window.location.href = base + '/error';
		}
		var data = dataObject.data;
		data.forEach(function (d) {
		})
	})
}

