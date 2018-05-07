
var sliders = [
	{name: 'acousticness', definition: 'test'}
];



// DOM Ready =============================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	populateArtistList();
	appendSliders();

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
	//run handlebars -m views/partials/Components/ -f  public/js/templates.js
	var template = Handlebars.templates['artist'];
	var totalHtml = "";
	$.getJSON( base + '/getArtist?token=' +spotifyToken + '&limit=5', function( data ) {
		data.forEach(function (d) {
			var html = template(d);
			totalHtml += html;
		});
		$( "#artistList" ).append(totalHtml)
	});

};

function appendSliders() {
	var template = Handlebars.templates['slider'];
	var totalHtml = "";
	sliders.forEach(function (d) {
		var html = template(d);
		totalHtml += html;
	})
	$("#sliders").append(totalHtml)
}



