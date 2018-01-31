var spotifyToken = $.cookie('spotify-token');
var refreshToken = $.cookie('refresh-token');
var userID = $.cookie('userid');




// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateArtistList();
	$(document).on('click', ".checkSlider", function(event) {

		event.stopPropagation();
		var seed = $(this).parent().parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		var checkbox = $(this).parent();
		var checkSlider = $(this);
		selectArtist(seed, index, checkbox, checkSlider);
		addRecord(userID, 'checkSlider', 'click', index)

	});

	$(document).on('click', ".checkbox", function(event) {
		//prevent this function to be triggered on click slider
		event.stopPropagation();
		var seed = $(this).parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		var checkbox = $(this);
		var checkSlider = $(this).children();
		selectArtist(seed, index, checkbox, checkSlider)
		addRecord(userID, 'checkBox', 'click', index)

	});

});

function selectArtist(seed, index, checkbox, slider) {
	if (index !== -1){
		$('.warningLimitNb').css('display','none');
		selectedArtists.splice(index, 1);
		$('#' + seed).removeClass("selected");
		checkbox.removeClass("selected");
		slider.removeClass("selected");

	}
	else {
		if (selectedArtists.length >= 5) {
			$('.warningLimitNb').css('display', 'block');
			setTimeout("$('.warningLimitNb').css('display','none')", 2000);

		}
		else {
			$('#' + seed).addClass("selected");
			checkbox.addClass("selected");
			slider.addClass("selected");
			selectedArtists.push(seed);
		}
	}
}



function populateArtistList() {

	// jQuery AJAX call for JSON
	$.getJSON( '/getArtist?token=' +spotifyToken, function( data ) {
		data.forEach(function (d) {
			$( "#infoArtists" ).append('<div class="artistDiv" id="' + d.id + '"></div>');
			$("#" +d.id )
				.append('<div class="checkbox" id="checkbox_' + d.id + '"></div>')
				.append('<div class="artistName">' + d.name + '</div>');
		});
		addSlider();
	});
};

function addSlider() {
	$(".checkbox" ).append('<div class="checkSlider"></div>');
}

