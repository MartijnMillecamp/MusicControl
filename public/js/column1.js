var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];
// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateArtistList();

	$(document).on('click', ".artistDiv", function() {
		var seed = $(this).attr('id');

		var index = $.inArray(seed, selectedArtists);
		if (index !== -1){
			selectedArtists.splice(index, 1);
			$(this).css('background', '#76ed8f');
			$(this).css('border-color', 'rgba(24,24,24,1)');

		}
		else{
			$(this).css('background', 'gray');
			$(this).css('border-color', '#b07ac3fc');
			selectedArtists.push(seed)
		}
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

