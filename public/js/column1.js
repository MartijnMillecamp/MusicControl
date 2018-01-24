var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];
// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateArtistList();
	$(document).on('click', ".checkSlider", function() {
		var seed = $(this).parent().parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		if (index !== -1){
			$('.warningLimitNb').css('display','none');
			selectedArtists.splice(index, 1);
			$('#' + seed).removeClass("selected");
			$(this).removeClass("selected");
			$(this).parent().removeClass("selected");

		}
		else{
			if(selectedArtists.length >= 5){
				$('.warningLimitNb').css('display','block');
				setTimeout("$('.warningLimitNb').css('display','none')",2000);

			}
			else {
				$('#' + seed).addClass("selected");
				$(this).addClass("selected");
				$(this).parent().addClass("selected");
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
		});
		addCheckbox();
		addSlider();
	});
};

function addCheckbox() {
	$(".artistDiv" ).append('<div class="checkbox"></div>');
}

function addSlider() {
	$(".checkbox" ).append('<div class="checkSlider"></div>');
}

