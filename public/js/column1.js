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
			$('.warningLimitNb').css('display','none');
			selectedArtists.splice(index, 1);
			$(this).removeClass("selected");
		}
		else{
			if(selectedArtists.length >= 5){
				$('.warningLimitNb').css('display','block');
				setTimeout("$('.warningLimitNb').css('display','none')",2000);

			}
			else {
				$(this).addClass("selected");
				selectedArtists.push(seed);
			}

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

