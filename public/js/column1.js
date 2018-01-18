var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];
// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateArtistList();

	$(document).on('click', ".artistDiv", function() {
		var artist = this.textContent;
		var seed = $(this).attr('id')

		var index = $.inArray(seed, selectedArtists);
		if (index !== -1){
			selectedArtists.splice(index, 1);
			$(this).css('background', '#76ed8f');
		}
		else{
			$(this).css('background', 'gray');
			selectedArtists.push(seed)
		}

		console.log(selectedArtists)
	});

});


function populateArtistList() {

	// jQuery AJAX call for JSON
	$.getJSON( '/getArtist?token=' +spotifyToken, function( data ) {

		data.forEach(function (d) {
			$( "#infoArtists" ).append('<div class="artistDiv" id="' + d.id + '">' + d.name + '</div>')
		})
	});
};

