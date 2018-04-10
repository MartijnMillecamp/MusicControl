




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
		addRecord('checkSlider', 'click', index)

	});

	$(document).on('click', ".checkbox", function(event) {
		//prevent this function to be triggered on click slider
		event.stopPropagation();
		var seed = $(this).parent().attr('id');
		var index = $.inArray(seed, selectedArtists);
		var checkbox = $(this);
		var checkSlider = $(this).children();
		selectArtist(seed, index, checkbox, checkSlider)
		addRecord('checkBox', 'click', index)

	});

});

function selectArtist(seed, index, checkbox, slider) {
	//deselect an artist
	if (index !== -1){
		$('.warningLimitNb').css('display','none');
		selectedArtists.splice(index, 1);
		$('#' + seed).removeClass("selected");
		checkbox.removeClass("selected");
		slider.removeClass("selected");
		if(selectedArtists.length === 0){
			flashButton(false)
		}
	}
	//select a new artist
	else {
		flashButton(true);
		if (selectedArtists.length >= 5) {
			$('.warningLimitNb').css('display', 'block');
			setTimeout("$('.warningLimitNb').css('display','none')", 3000);

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
	$.getJSON( base + '/getArtist?token=' +spotifyToken, function( data ) {
		var counter = 0;
		data.forEach(function (d) {
			//just for screenshot paper
			counter++
			if(counter < 14){
				$( "#infoArtists" ).append('<div class="artistDiv" id="' + d.id + '"></div>');
				$("#" +d.id )
					.append('<div class="checkbox" id="checkbox_' + d.id + '"></div>')
					.append('<div class="artistName">' + d.name + '</div>');
			}

		});
		addSlider();
	});
};

function addSlider() {
	$(".checkbox" ).append('<div class="checkSlider"></div>');
}



