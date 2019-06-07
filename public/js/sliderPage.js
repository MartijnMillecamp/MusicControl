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

var interfaceDev = $.cookie("interfaceDev" );



$(document).ready(function () {
  $("#button_sliderPage").click(function () {
    $.cookie("targetValues", JSON.stringify(targetValues));
    window.location.href = base + "/home?" + userID + "&interfaceDev=" + interfaceDev;
  });
  
  //need sliders for the definitions
  sliders.forEach(function (sliderData) {
    sliderName = sliderData.name;
    if (selectedSliders.indexOf(sliderName) !== -1){
      makeSliderAttributeContainer(sliderData);
      appendSlider(sliderData)
    }
  });
  
  showExampleSongs();
  
  appendSliders();
  
  
  
});

function makeSliderAttributeContainer(data) {
  var template = Handlebars.templates["sliderAttribute"];
  var html = template(data);
  $("#totalSliderPageContainer").append(html);
}

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

function appendSlider(slider) {
  var template = Handlebars.templates['sliderPageSlider'];
  var totalHtml = template(slider);
  $("#sliderContainer_" + slider.name).append(totalHtml);
  
  var id = slider.name;
  var min = slider.minValue;
  var max = slider.maxValue;

  var visible = false;
  var index = selectedSliders.indexOf(id)
  if(index > -1){
    visible = true;
  }

  targetValues['min_' + id] = min;
  targetValues['max_' + id] = max;


  if( visible) {
    $('#' + id + "_sliderPage_div").slider({
      range: true,
      step: 1,
      min: min,
      max: max,
      values: [min, max],
      slide: function (event, ui) {
        var id = $(this).attr('id').split('_')[0];
        $("#" + id + '_output').val(" " + ui.values[0] + " to " + ui.values[1]);
        targetValues['min_' + id] = ui.values[0];
        targetValues['max_' + id] = ui.values[1];
      },
      stop: function (event, ui) {
        var name = $(event.target).attr('id').split('_')[0]
        addInteraction("slider_" + name, "slide", ui.values);
      }
    });
  
    var color = colors[index];
    slider.label = labels[index];
    slider.color = colors[index];
    $('#' + id + '_sliderPage_div > .ui-slider-range').css('background', color);
  
  }
}
