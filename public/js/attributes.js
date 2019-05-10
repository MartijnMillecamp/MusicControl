
var interface = $.cookie('interfaceDev');
var selectedSliders = [];

// DOM Ready =============================================================
$(document).ready(function() {
	//need sliders for the definitions
	sliders.forEach(function (sliderData) {
		makeAttributeContainer(sliderData)
	});

	showExampleSongs();

	$('#button_attributes').click(function () {

		window.location.href = base + '/home?' + userID + '&interfaceDev=' + interface;

	});



	$('.showExamplesButton').click(function (event) {
		var button = $(this);
		var buttonName = button.attr('id').split("_")[1];
		var songDiv = $('#songDiv_' + buttonName);
		var hasClass = songDiv.hasClass('selected');
		if(!hasClass){
			songDiv.addClass("selected");
			button.html("Hide Examples")
		}
		else{
			songDiv.removeClass("selected");
			button.html("Show Examples")
		}
	});

	$('.selectAttributeButton').click(function (event) {
		var button = $(this);
		var buttonName = button.attr('id').split("_")[2];
		var container = $('#attributeContainer_' + buttonName);
		var selectedAttr = button.hasClass('selectedAttr');


		for(var i=0; i < sliders.length ; i++) {
			var slider = sliders[i];
			if (slider.name === buttonName){
				if (selectedAttr){
					button.removeClass('selectedAttr');
					container.removeClass('selectedContainer');
					button.html("Select this attribute");
					selectedSliders = removeFromList(selectedSliders, buttonName)
				}
				else{
					button.addClass('selectedAttr');
					container.addClass('selectedContainer');
					button.html("Selected");
					selectedSliders.push(buttonName)
				}
			sliders[i] = slider;
			}
		}
		$.cookie('selectedSliders', JSON.stringify(selectedSliders));
	})




});

/**
 * Function that starts displaying the songs
 */
function showExampleSongs() {
	var acousticnessExamples = ['7ef4DlsgrMEH11cDZd32M6','64Tp4KN5U5rtqrasP5a7FH','3U4isOIWM3VvDubwSI3y7a'];
	var danceabilityExamples = ['6hUbZBdGn909BiTsv70HP6','7DFNE7NO0raLIUbgzY2rzm','7qiZfU4dY1lWllzX7mPBI3'];
	var energyExamples = ['3xXBsjrbG1xQIm1xv1cKOt','40riOy7x9W7GXjyGp4pjAv','0EYOdF5FCkgOJJla8DI2Md'];
	var instrumentalnessExamples = ['2374M0fQpWi3dLnB54qaLX','0q6LuUqGLUiCPP1cbdwFs3','5pT4qRIpNb7cASsnMfE1Hc'];
	var tempoExamples = ['3d9DChrdc6BOeFsbrZ3Is0','0ofHAoxe9vBkTCp2UQIavz','3GXhz5PnLdkG4DEWNzL8z8'];
	var valenceExamples = ['6b2oQwSGFkzsMtQruIWm2p','6Qyc6fS4DsZjB2mRW9DsQs','1KsI8NEeAna8ZIdojI3FiT'];


	getExampleSongs(acousticnessExamples, 'acousticness');
	getExampleSongs(danceabilityExamples, 'danceability');
	getExampleSongs(energyExamples, 'energy');
	getExampleSongs(instrumentalnessExamples, 'instrumentalness');
	getExampleSongs(tempoExamples, 'tempo');
	getExampleSongs(valenceExamples, 'valence');
}

function makeAttributeContainer(data) {
	var template = Handlebars.templates['attributeContainer'];
	var html = template(data);
	$('#totalExampleContainer').append(html);
}

function getExampleSongs(trackIds, name) {
	getExampleSong(trackIds[0], 'low_' + name);
	getExampleSong(trackIds[1], 'medium_' + name);
	getExampleSong(trackIds[2], 'high_' + name);

}

function getExampleSong(trackId, divId) {
	var similarArtist = 'demo';
	//Check if in database or not
	var query = base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist;
	$.getJSON(query, function (song) {
		if (song === null) {
			//Song not in database
			addSong(trackId, null, similarArtist, [], divId )
		}
		else {
			displayAttributeSong(song, divId)
		}
	});
}

function displayAttributeSong(song, divId){
	var template = Handlebars.templates['attributeSong'];
	var html = template(song)
	$('#' + divId).append(html)
}