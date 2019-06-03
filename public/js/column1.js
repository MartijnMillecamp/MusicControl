// DOM Ready =============================================================
$(document).ready(function() {
	if( window.location.pathname === "/home"){
		// Populate the user table on initial page load
		// populateArtistList();
	}


	$(document).on("click", ".artistDiv", function(event) {
		//Do nothing if disabled
		if(!$(event.currentTarget).hasClass("disabled")){
			event.stopPropagation();
			var targetClass = $(event.target).attr("class")
			if (targetClass !== "far fa-times-circle"){
				var artistId = $(this).attr("id");
				var artistName = $(this).attr("name")
				var index = $.inArray(artistId, selectedArtists);
				clickArtist(artistId, index, artistName);
			}
		}
	});

	

	$(document).on("click", "#search", function () {
		$("#searchList").css("display", "none");
		$( "#searchResults" ).html("");
	});



	

});





function populateArtistList() {
	var template = Handlebars.templates["artist"];
	var totalHtml = "";
	$.getJSON( base + "/getTopArtists?token=" +spotifyToken + "&limit=10", function( dataObject ) {
		if (dataObject.error){
			addInteraction("topartist","error", "error")

			window.location.href = base + "/error";
		}
		else{
			var data = dataObject.data;
			if (data !== null && data.length > 0){
				for( var i=0; i< data.length; i++){
					if(first === "true"){
						if(i % 2 === 0){
							var d = data[i]
							var html = template(d);
							totalHtml += html;
							artists.push(d.id)
						}
					}
					else{
						if(i % 2 === 1){
							var d = data[i];
							var html = template(d);
							totalHtml += html;
							artists.push(d.id)
						}
					}
				}
				$( "#artistList" ).append(totalHtml)
			}
			else{
				$( ".noTopArtists" ).css("display", "block")
			}
		}


	});
};






function addShape(artistId){
	var shape = d3.svg.symbol()
		.type(function (d) {
			return getArtistShape(d.similarArtist)
		})
		.size(150);

	var shapes = [];
	shapes.push({
		x: 15,
		similarArtist: artistId
	});
	$("#" + artistId + "_artistShape")
		.css("display", "flex")
		.html("");
	var svg = d3.select($("#" + artistId + "_artistShape").get(0));
	svg.selectAll("path")
		.data(shapes)
		.enter()
		.append("path")
		.attr("d", shape)
		.attr("fill", "black")
		.attr("transform", function(d) {
			return "translate(" + d.x + ",15)";
		});
}

function getRecommendationsAllArtists() {
	recommendedSongs = [];
	var last = selectedArtists.length - 1;
	//Need to reverse to keep same tab active
	var reverse = selectedArtists.reverse();
	for( var i = 0; i <= last; i++){
		var similarArtist = reverse[i];
		getRecommendationsArtist(similarArtist)
		// showArtistTab(activeArtistId)
	}
}


/**
 * Get recommendations for an artist from the Spotify API
 * Update the view as soon as you have 10 artists or at the end of the recommendations
 * @param similarArtist
 *
 */
function getRecommendationsArtist(similarArtist) {
	var queryBaseTarget = base + "/getRecTarget?token=" +spotifyToken + "&limit=" + 50 + "&artists=" + similarArtist;
	var queryBaseRange = base + "/getRecRange?token=" +spotifyToken + "&limit=" + 50 + "&artists=" + similarArtist;


	// "&userId=" + userID + "&likedSongs=" + likedSongs.length + "&dislikedSongs=" + dislikedSongs.length;


	var targetAcousticnes = (targetValues.min_acousticness + targetValues.max_acousticness) / 2;
	var targetDanceability = (targetValues.min_danceability + targetValues.max_danceability) / 2;
	var targetDuration = (targetValues.min_duration + targetValues.max_duration) / 2;
	var targetEnergy = (targetValues.min_energy + targetValues.max_energy) / 2;
	var targetInstrumentalness = (targetValues.min_instrumentalness + targetValues.max_instrumentalness) / 2;
	var targetLiveness = (targetValues.min_liveness + targetValues.max_liveness) / 2;
	var targetLoudness = (targetValues.min_loudness + targetValues.max_loudness) / 2;
	var targetPopularity = (targetValues.min_popularity + targetValues.max_popularity) / 2;
	var targetSpeechiness = (targetValues.min_speechiness + targetValues.max_speechiness) / 2;
	var targetTempo = (targetValues.min_tempo + targetValues.max_tempo) / 2;
	var targetValence = (targetValues.min_valence + targetValues.max_valence) / 2;


	var queryTargetAttributes = "&target_acousticness=" + targetAcousticnes +
		"&target_danceability=" + targetDanceability + "&target_duration=" + targetDuration +
		"&target_energy=" + targetEnergy + "&target_instrumentalness=" + targetInstrumentalness +
		"&target_liveness=" + targetLiveness + "&target_loudness=" + targetLoudness +
		"&target_popularity=" + targetPopularity + "&target_speechiness=" + targetSpeechiness +
		"&target_tempo=" + targetTempo + "&target_valence=" + targetValence;


	var queryRangeAttributes =
		"&min_acousticness=" + targetValues.min_acousticness + "&max_acousticness=" + targetValues.max_acousticness +
		"&min_danceability=" + targetValues.min_danceability + "&max_danceability=" + targetValues.max_danceability +
		"&min_duration=" + targetValues.min_duration + "&max_duration=" + targetValues.max_duration +
		"&min_energy=" + targetValues.min_energy + "&max_energy=" + targetValues.max_energy +
		"&min_instrumentalness="+targetValues.min_instrumentalness + "&max_instrumentalness="+targetValues.max_instrumentalness +
		"&min_liveness=" + targetValues.min_liveness + "&max_liveness=" + targetValues.max_liveness +
		"&min_loudness=" + targetValues.min_loudness + "&max_loudness=" + targetValues.max_loudness +
		"&min_popularity=" + targetValues.min_popularity + "&max_popularity=" + targetValues.max_popularity +
		"&min_speechiness=" + targetValues.min_speechiness + "&max_speechiness=" + targetValues.max_speechiness +
		"&min_valence=" + targetValues.min_valence + "&max_valence=" + targetValues.max_valence +
		"&min_tempo="+targetValues.min_tempo + "&max_tempo="+targetValues.max_tempo;


	var queryTarget = queryBaseTarget.concat(queryTargetAttributes);
	var queryRange = queryBaseRange.concat(queryRangeAttributes);
	$.getJSON( queryRange , function( dataObject ) {
		if (dataObject.error){
			addInteraction("recommendations","error", "error");
			window.location.href = base + "/error";
		}
		else{
			var data = dataObject.data;

			var nbAppendedArtists = 0;
			var appendedSongslist = [];
			data.forEach(function (d,i) {
				var index = likedSongs.indexOf(d.id);
				var indexDisliked = dislikedSongs.indexOf(d.id)
				//this is needed to know when you arrived with the last song, so you can update
				if(index === -1 && indexDisliked === -1 && d.preview_url !== null && nbAppendedArtists < totalNbOfRecommendations) {
					nbAppendedArtists++;
					appendedSongslist.push(d.id);
				}
			});

			nbAppendedArtists = 0;
			data.forEach(function (d,i) {
				var index = likedSongs.indexOf(d.id);
				var indexDisliked = dislikedSongs.indexOf(d.id);
				//Don"t do anything if preview is null or already appended 10 songs or already liked
				if(index === -1 && indexDisliked === -1 && d.preview_url !== null && nbAppendedArtists < totalNbOfRecommendations){
					nbAppendedArtists ++;
					appendSong(d.id, d.preview_url, similarArtist, appendedSongslist);
				}
			})
		}
	})

}

/**
 *
 * @param trackId
 * @param similarArtist
 * @param appendedSongslist
 */
function appendSong(trackId, url, similarArtist, appendedSongslist) {
	var query = base + "/getSong?trackId=" + trackId + "&similarArtist=" + similarArtist;
	$.getJSON(query, function (song) {
		if( song === null){
			//Song not in database
			addSong(trackId, url, similarArtist, appendedSongslist, "NA");
		}
		else{
			appendRecommendationsArtist(song, similarArtist, appendedSongslist)
		}
	});
}





//Chain functions because of asynchronous character
function addSong(trackId, url, similarArtist, appendedSongslist, divId){
	getAudioFeatures(trackId, url, similarArtist, appendedSongslist, divId);
}

function getAudioFeatures(trackId, url, similarArtist, appendedSongslist, divId) {
	var query = base + "/getAudioFeaturesForTrack?token=" +spotifyToken + "&trackId=" + trackId;
	$.getJSON(query, function (dataObject) {
		})
		.done(function(dataObject) {
			if (dataObject.error){
				console.log("starting to crash", dataObject)
				window.location.href = base + "/error";
			}
			else{
				getTrack(trackId, url, dataObject.data, similarArtist, appendedSongslist, divId)
			}
		});
}

function getTrack(trackId, url, audioFeatures, similarArtist, appendedSongslist, divId) {
	var query = base + "getSongFromId?token=" + spotifyToken + "&trackId=" + trackId;
	$.getJSON(query, function (dataObject) {
	})
		.done(function (dataObject) {
			if (dataObject.error){
				console.log("starting to crash", dataObject)
				window.location.href = base + "/error";
			}
			else{
				var acoustiness = audioFeatures.acousticness;
				var danceability = audioFeatures.danceability;
				var duration = dataObject.data.body.duration_ms;
				var energy = audioFeatures.energy;
				var instrumentalness = audioFeatures.instrumentalness;
				var liveness = audioFeatures.liveness;
				var loudness = audioFeatures.loudness;
				var popularity = dataObject.data.body.popularity;
				var speechiness = audioFeatures.speechiness;
				var tempo = audioFeatures.tempo;
				var valence = audioFeatures.valence;
				var image = dataObject.data.body.album.images[1].url

				var attributes = "&acousticness=" + acoustiness +
					"&danceability=" + danceability +
					"&duration=" + duration+
					"&energy=" + energy +
					"&instrumentalness=" + instrumentalness +
					"&liveness=" + liveness +
					"&loudness=" + loudness +
					"&popularity=" + popularity +
					"&speechiness=" + speechiness +
					"&tempo=" + tempo +
					"&valence=" + valence;


				var title = dataObject.data.body.name;
				var artist = dataObject.data.body.artists[0].name;
				var preview = url;
				var trackInfo = "&title=" + title + "&artist=" + artist +
					 "&preview=" + preview + "&image=" + image;

				var query = base + "/addSong?trackId=" + trackId + attributes + trackInfo ;
				addSongToDatabase(query, trackId, similarArtist, appendedSongslist, divId);

			}
		})
}

/**
 * Function used for both attributessongs and for recommendations
 * @param query
 * @param trackId
 * @param similarArtist
 * @param appendedSongslist
 * @param divId
 */
function addSongToDatabase(query, trackId, similarArtist, appendedSongslist, divId) {
	$.getJSON(query, function (message) {
		// console.log(message)
	})
		.done(function () {
			$.getJSON(base + "/getSong?trackId=" + trackId, function (song) {
				if(similarArtist !== "demo"){
					if (divId === "makeProfile"){
						addToProfile(song, similarArtist)
					}
					else{
            appendRecommendationsArtist(song, similarArtist, appendedSongslist)
          }
				}
				else{
					displayAttributeSong(song, divId)
				}
			})
		})
}







