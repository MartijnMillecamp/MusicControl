
var selectedSliders = [];

var exampleSongs = {
	acousticness: ["7ef4DlsgrMEH11cDZd32M6","64Tp4KN5U5rtqrasP5a7FH","3U4isOIWM3VvDubwSI3y7a"],
	danceability: ["6hUbZBdGn909BiTsv70HP6","7DFNE7NO0raLIUbgzY2rzm","7qiZfU4dY1lWllzX7mPBI3"],
	energy: ["3xXBsjrbG1xQIm1xv1cKOt","40riOy7x9W7GXjyGp4pjAv","0EYOdF5FCkgOJJla8DI2Md"],
	instrumentalness: ["2374M0fQpWi3dLnB54qaLX","0q6LuUqGLUiCPP1cbdwFs3","5pT4qRIpNb7cASsnMfE1Hc"],
	popularity: ["7v0dqdKggXTjBDMb1ORHZX","2MMvonKGALz6YOJwaKDO3q","06KyNuuMOX1ROXRhj787tj"],
	tempo: ["3d9DChrdc6BOeFsbrZ3Is0","0ofHAoxe9vBkTCp2UQIavz","3GXhz5PnLdkG4DEWNzL8z8"],
	valence: ["6b2oQwSGFkzsMtQruIWm2p","6Qyc6fS4DsZjB2mRW9DsQs","1KsI8NEeAna8ZIdojI3FiT"]
}

var acousticnessExamples = ["7ef4DlsgrMEH11cDZd32M6","64Tp4KN5U5rtqrasP5a7FH","3U4isOIWM3VvDubwSI3y7a"];
var danceabilityExamples = ["6hUbZBdGn909BiTsv70HP6","7DFNE7NO0raLIUbgzY2rzm","7qiZfU4dY1lWllzX7mPBI3"];
var energyExamples = ["3xXBsjrbG1xQIm1xv1cKOt","40riOy7x9W7GXjyGp4pjAv","0EYOdF5FCkgOJJla8DI2Md"];
var instrumentalnessExamples = ["2374M0fQpWi3dLnB54qaLX","0q6LuUqGLUiCPP1cbdwFs3","5pT4qRIpNb7cASsnMfE1Hc"];
var popularityExamples = ["7v0dqdKggXTjBDMb1ORHZX","2MMvonKGALz6YOJwaKDO3q","06KyNuuMOX1ROXRhj787tj"];
var tempoExamples = ["3d9DChrdc6BOeFsbrZ3Is0","0ofHAoxe9vBkTCp2UQIavz","3GXhz5PnLdkG4DEWNzL8z8"];
var valenceExamples = ["6b2oQwSGFkzsMtQruIWm2p","6Qyc6fS4DsZjB2mRW9DsQs","1KsI8NEeAna8ZIdojI3FiT"];

// DOM Ready =============================================================
$(document).ready(function() {
  //need sliders for the definitions
	sliders.forEach(function (sliderData) {
		makeAttributeContainer(sliderData);
	});

	showExampleSongs();

	$("#button_attributes").click(function () {
	  if (selectedSliders.length > 2 && selectedSliders.length < 7){
      addInteraction("submitAttributes", "click", -1);
      window.location.href = base + "/sliderPage" ;
    
    }
    else if (selectedSliders.length < 3) {
	    alert("Select at least 3 attributes");
    }
    else{
	  	alert("Select at most 6 attributes")
	  }
	});
	
	
  $(".definition").hover(function () {
    $(this).toggleClass("active");
  });
  
  $(".selectAttributeButton").hover(function () {
    $(this).toggleClass("active");
  });
  
  $(".showExamplesButton").hover(function () {
    $(this).toggleClass("active");
  });


	$(".showExamplesButton").click(function (event) {
		var button = $(this);
		var buttonName = button.attr("id").split("_")[1];
		var songDiv = $("#songDiv_" + buttonName);
		var hasClass = songDiv.hasClass("selected");
		if(!hasClass){
			songDiv.addClass("selected");
			button.html("Hide Examples");
		}
		else{
			songDiv.removeClass("selected");
			button.html("Show Examples");
			stopAllMusic(buttonName)
		}
	});

	$(".selectAttributeButton").click(function (event) {
    var button = $(this);
		var buttonName = button.attr("id").split("_")[2];
		var container = $("#attributeContainer_" + buttonName);
		var selectedAttr = button.hasClass("selectedAttr");
    
    
    for(var i=0; i < sliders.length ; i++) {
			var slider = sliders[i];
			if (slider.name === buttonName){
				if (selectedAttr){
					button.removeClass("selectedAttr");
					container.removeClass("selectedContainer");
					button.html("Select this attribute");
					selectedSliders = removeFromList(selectedSliders, buttonName)
          addInteraction("deselectAttribute", "click", buttonName);
          
        }
				else{
					button.addClass("selectedAttr");
					container.addClass("selectedContainer");
					button.html("Selected");
					selectedSliders.push(buttonName)
          addInteraction("selectAttribute", "click", buttonName);
          
        }
			sliders[i] = slider;
			}
		}
		selectedSliders.sort();
		$.cookie("selectedSliders", JSON.stringify(selectedSliders));
	})




});

/**
 * Function that starts displaying the songs
 */
function showExampleSongs() {
	
	getExampleSongs(acousticnessExamples, "acousticness");
	getExampleSongs(danceabilityExamples, "danceability");
	getExampleSongs(energyExamples, "energy");
	getExampleSongs(instrumentalnessExamples, "instrumentalness");
  getExampleSongs(popularityExamples, "popularity");
  getExampleSongs(tempoExamples, "tempo");
	getExampleSongs(valenceExamples, "valence");
}

function makeAttributeContainer(data) {
	var template = Handlebars.templates["attributeContainer"];
	var html = template(data);
	$("#totalExampleContainer").append(html);
}

function getExampleSongs(trackIds, name) {
	getExampleSong(trackIds[0], "low_" + name);
	getExampleSong(trackIds[1], "medium_" + name);
	getExampleSong(trackIds[2], "high_" + name);

}

function getExampleSong(trackId, divId) {
	var similarArtist = "demo";
	//Check if in database or not
	var query = base + "/getSong?trackId=" + trackId + "&similarArtist=" + similarArtist;
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
	var template = Handlebars.templates["attributeSong"];
	var html = template(song);
	$("#" + divId).append(html)
}

function stopAllMusic(attribute) {
	var songs = exampleSongs[attribute];
	for (var i = 0; i < 4; i++){
		var trackId = songs[i];
		var button = $("#exampleTrackButton_" + trackId);
		stopMusic(trackId, button)
	}
	
}