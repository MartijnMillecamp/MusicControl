var profileSongs = {};
var topTracksLength = {};


$(document).ready(function() {
  $(document).on("keypress", "#search", function (e) {
    if (e.which === 13) {
      var searchField = $("#search");
      var query = searchField.val();
      searchArtist(query);
      searchField.val("");
      searchField.prop("disabled", true);
      searchField.prop("disabled", false);
      addInteraction("search", "click", query);
    }
  });
  
  $(document).on("click", ".fa-times-circle", function(event) {
    var id = $(this).attr("id").split('_')[0];
    //Do nothing if artistdiv is disabled
    artistDiv = $("#"+ id);
    if(!artistDiv.hasClass("disabled")){
      addInteraction("removeArtist", "click", id);
      artistDiv.remove();
      //Remove from artist list
      indexArtist = artists.indexOf(id);
      console.log(id);
      if (indexArtist !== -1){
        artists.splice(indexArtist, 1);
      }
    }
    
  });
});



function searchArtist(searchTerm) {
  var template = Handlebars.templates["searchResult"];
  var totalHtml = "";
  $( "#searchResults" ).html("");
  
  
  var query = "/searchArtist?token=" + spotifyToken + "&q=" + searchTerm + "&limit=" + 10;
  $.getJSON(query, function (dataObject) {
    if (dataObject.error){
      window.location.href = base + "/error";
      addInteraction("searchArtist","error", "error")
    }
    
    var data = dataObject.data;
    if (data.length === 0){
      $("#searchList").css("display","block");
      $( "#searchResults" ).append("No results found")
    }
    $("#searchList").css("display","block");
    $("#artistList").css("display","none");
  
    data.forEach(function (d,i) {
      var image = getArtistImage(d)
      var resultObject = {
        index: i,
        imageSrc : image,
        artistName: d.name,
        id: d.id
      };
      totalHtml += template(resultObject);
    });
    
    $( "#searchResults" ).append(totalHtml)
  })
}

function getArtistImage(d){
  if (d.images[0] === undefined){
    return "../../img/no-image-icon.png"
  }
  else{
    return d.images[0].url
  }
}

/**
 * Append artist from search results to list
 * @param artistName
 * @param id
 */
function appendSearchResult(artistName, id, image) {
  setTimeout(enableAllInput(), 1000)
  
  $("#artistList").css("display","flex");
  
  addInteraction("searchResult", "click", id);
  //if it is a new artist, append to list and append dom
  if (artists.indexOf(id) === -1){
    artists.push(id);
    //append dom element
    var template = Handlebars.templates["artist"];
    var object = {
      id: id,
      name: artistName,
      imageSrc : image
    };
    var html = template(object);
    $( "#artistList" ).append(html);
  }

  
  //Remove search results
  $("#searchList").css("display", "none");
  $( "#searchResults" ).html("");
  //Select search result
  var index = $.inArray(id, selectedArtists);
  clickArtist(id, index, artistName);
}

/**
 * Select an artist and do whatever needed
 * @param artistId  id of artist you (de)select
 * @param index   if index = -1 you select an artist, otherwise you deselect an artist
 * @param artistName
 */
function clickArtist(artistId, index, artistName) {
  //deselect an artist
  if (index !== -1){
    deselectArtist(index, artistId);
    addInteraction("artistDiv", "deselect", artistId);
  }
  //select a new artist
  else {
    selectArtist(artistId, artistName);
    addInteraction("artistDiv", "select", artistId);
  }
}

function selectArtist(artistId, artistName){
  
  var activeArtist = selectedArtists[0];
  if (activeArtist !== undefined){
    deselectArtist(0, activeArtist);
  }
  //If a complete new artist: make a div
  if(! $("#recList_" + artistId).length){
    $("#recList").append("<div class=tabContent id=recList_" + artistId +  " ></div>" );
  }
  
  $("#" + artistId).addClass("selected");
  selectedArtists.push(artistId);
  if(selectedArtists.length > 1){
    $("#tab_All").css("display", "block")
  }
  $("#" + artistId + "_delete").css("display","none");
  $("#recList_" + artistId).css("display", "grid");
  makeArtistProfile(artistId);
  getRecommendationsArtist(artistId);
}

function deselectArtist(index, artistId) {
  selectedArtists.splice(index, 1);
  $("#" + artistId).removeClass("selected");
  //Show symbol to delete and remove thumbtack
  $("#" + artistId + "_delete").css("display","block");
  $("#" + artistId + "_thumbtack").css("visibility","hidden");
  $("#" + artistId + "_artistColor").css("display","none");
  $("#" + artistId + "_artistShape").css("display","none");
  //Remove data of artist
  removeRecommendation(artistId);
};

function makeArtistProfile(artistId) {
  profileSongs[artistId] = [];
  var query = base + "/getArtistTopTracks?token=" + spotifyToken + "&artistId=" + artistId ;
  $.getJSON(query, function (dataObject) {
    })
    .done(function(dataObject) {
      if (dataObject.error){
        console.log("starting to crash", dataObject)
        window.location.href = base + "/error";
      }
      else{
        var data = dataObject.data.tracks;
        topTracksLength[artistId] = data.length;
        for(var i = 0; i < topTracksLength[artistId]; i++){
          var song = data[i];
          var trackId = song.id;
          var url = song.url;
          getSongForProfile(trackId, url, artistId)
        }
      }
    });
}

function getSongForProfile(trackId, url, artistId) {
  var query = base + "/getSong?trackId=" + trackId + "&similarArtist=" + artistId;
  $.getJSON(query, function (song) {
    if( song === null){
      //Song not in database
      addSong(trackId, url, artistId, [], 'makeProfile');
    }
    else{
      addToProfile(song, artistId)
    }
  });
}

function addToProfile(song, artistId) {
  list = profileSongs[artistId];
  list.push(song);
  
  profileSongs[artistId] = list;
  if (profileSongs[artistId].length === topTracksLength[artistId]){
    calculateProfile(artistId)
  }
}

function calculateProfile(artistId){
  acousticness = [];
  danceability = [];
  duration = [];
  energy = [];
  instrumentalness = [];
  liveness = [];
  loudness = [];
  popularity = [];
  speechiness = [];
  tempo = [];
  valence = [];
  
  for (var i = 0; i < profileSongs[artistId].length; i++){
    song = profileSongs[artistId][i];
    acousticness.push(song.acousticness);
    danceability.push(song.danceability);
    duration.push(song.duration);
    energy.push(song.energy);
    instrumentalness.push(song.instrumentalness);
    liveness.push(song.liveness);
    loudness.push(song.loudness);
    popularity.push(song.popularity);
    speechiness.push(song.speechiness);
    tempo.push(song.tempo);
    valence.push(song.valence);
  }
  var groupedDataSongAll = [
    {name: 'acousticness' , min:getMinimum(acousticness) , max:getMaximum(acousticness, 100) },
    {name: 'danceability' , min:getMinimum(danceability) , max:getMaximum(danceability, 100)},
    {name: 'duration' , min:getMinimum(duration) , max:getMaximum(duration, 100)},
    {name: 'energy' ,min:getMinimum(energy) , max:getMaximum(energy, 100) },
    {name: 'instrumentalness' ,min:getMinimum(instrumentalness) , max:getMaximum(instrumentalness, 100) },
    {name: 'liveness' , min:getMinimum(liveness) , max:getMaximum(liveness, 100)},
    {name: 'loudness' , min:getMinimum(loudness) , max:getMaximum(loudness, 100)},
    {name: 'popularity' ,min:getMinimum(popularity) , max:getMaximum(popularity, 100) },
    {name: 'speechiness' ,min:getMinimum(speechiness) , max:getMaximum(speechiness, 100) },
    {name: 'tempo' , min:getMinimum(tempo) , max:getMaximum(tempo, 250)},
    {name: 'valence' ,min:getMinimum(valence) , max:getMaximum(valence, 100) }
  ];
  var groupedDataSong = [];
  selectedSliders.forEach(function (slider) {
    groupedDataSongAll.forEach(function (d) {
      if (d.name === slider){
        groupedDataSong.push(d)
      }
    })
  })
  makeProfileBarsArtist(groupedDataSong, artistId);
}

function getMinimum(list) {
  return Math.max(Math.min.apply(null, list),0)
}

function getMaximum(list, max) {
  var min = getMinimum(list);
  var maxList = Math.max.apply(null, list);
  return Math.min(max, Math.max(maxList, min + 5));
}