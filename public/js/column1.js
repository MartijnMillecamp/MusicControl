// DOM Ready =============================================================
$(document).ready(function() {
	if( window.location.pathname === "/home"){
		// Populate the user table on initial page load
		// populateArtistList();
	}


	$(document).on('click', ".artistDiv", function(event) {
		//Do nothing if disabled
		if(!$(event.currentTarget).hasClass('disabled')){
			event.stopPropagation();
			var targetClass = $(event.target).attr('class')
			if (targetClass !== 'far fa-times-circle'){
				var artistId = $(this).attr('id');
				var artistName = $(this).attr('name')
				var index = $.inArray(artistId, selectedArtists);
				clickArtist(artistId, index, artistName);
			}
		}
	});

	$(document).on('click', ".fa-times-circle", function(event) {
		//Do nothing if artistdiv is disabled
		if(!$(this).parent().hasClass('disabled')){
			var artistId = $(this).parent().attr('id');
			addInteraction('fa-times-circle', 'click', artistId);
			$(this).parent().remove();
		}
	});

	$(document).on('click', '#search', function () {
		$('#searchList').css('display', 'none');
		$( "#searchResults" ).html('');
	})



	$(document).on('keypress', '#search', function (e) {
		if (e.which === 13) {
			var searchField = $('#search')
			var query = searchField.val();
			searchArtist(query);
			searchField.val('');
			searchField.prop('disabled', true);
			searchField.prop('disabled', false);
			addInteraction('search', 'click', query);


		}
	});

});

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
		addInteraction('artistDiv', 'deselect', artistId);
	}
	//select a new artist
	else {
		selectArtist(artistId, artistName);
		addInteraction('artistDiv', 'select', artistId);
	}
}

function selectArtist(artistId, artistName){
	var activeArtist = selectedArtists[0];
	if (activeArtist !== undefined){
		deselectArtist(0, activeArtist)
	}
	//If a complete new artist: make a div
	if(! $('#recList_' + artistId).length){
		$('#recList').append('<div class=tabContent id=recList_' + artistId +  ' ></div>' );
	}

	$('#' + artistId).addClass("selected");
	selectedArtists.push(artistId);
	if(selectedArtists.length > 1){
		$('#tab_All').css('display', 'block')
	}
	$('#' + artistId + '_delete').css('display','none');
	$('#recList_' + artistId).css('display', 'block')
	getRecommendationsArtist(artistId);
}

function deselectArtist(index, artistId) {
	selectedArtists.splice(index, 1);
	$('#' + artistId).removeClass("selected");
	//Show symbol to delete and remove thumbtack
	$('#' + artistId + '_delete').css('display','block');
	$('#' + artistId + '_thumbtack').css('visibility','hidden');
	$('#' + artistId + '_artistColor').css('display','none');
	$('#' + artistId + '_artistShape').css('display','none');
	//Remove data of artist
	removeRecommendation(artistId);
}

function populateArtistList() {
	var template = Handlebars.templates['artist'];
	var totalHtml = "";
	$.getJSON( base + '/getTopArtists?token=' +spotifyToken + '&limit=10', function( dataObject ) {
		if (dataObject.error){
			addInteraction("topartis",'error', 'error')

			window.location.href = base + '/error';
		}
		else{
			var data = dataObject.data;
			if (data !== null && data.length > 0){
				for( var i=0; i< data.length; i++){
					if(first === 'true'){
						if(i % 2 === 0){
							var d = data[i]
							var html = template(d);
							totalHtml += html;
							artists.push(d.id)
						}
					}
					else{
						if(i % 2 === 1){
							var d = data[i]
							var html = template(d);
							totalHtml += html;
							artists.push(d.id)
						}
					}
				}
				$( "#artistList" ).append(totalHtml)
			}
			else{
				$( ".noTopArtists" ).css('display', 'block')
			}
		}


	});
};

function searchArtist(searchTerm) {
	$( ".noTopArtists" ).css('display', 'none');

	var template = Handlebars.templates['searchResult'];

	var totalHtml = "";
	var query = '/searchArtist?token=' + spotifyToken + '&q=' + searchTerm + '&limit=' + 2;
	$.getJSON(query, function (dataObject) {
		if (dataObject.error){
			window.location.href = base + '/error';
			addInteraction("searchArtist",'error', 'error')

		}

		var data = dataObject.data;
		if (data.length === 0){
			$('#searchList').css('display','block');
			$( "#searchResults" ).append("No results found")
		}
		$('#searchList').css('display','block')
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

function appendSearchResult(artistName, id) {
	addInteraction('searchResult', 'click', id);
	//append id to artistlist
	artists.push(id)
	//append dom element
	var template = Handlebars.templates['artist'];
	var object = {
		id: id,
		name: artistName
	};
	var html = template(object);
	$( "#artistList" ).append(html);
	//Remove search results
	$('#searchList').css('display', 'none');
	$( "#searchResults" ).html('');
	//Select search result
	var index = $.inArray(id, selectedArtists);
	clickArtist(id, index, artistName);
}

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
	$('#' + artistId + '_artistShape')
		.css('display', 'flex')
		.html('');
	var svg = d3.select($('#' + artistId + '_artistShape').get(0));
	svg.selectAll('path')
		.data(shapes)
		.enter()
		.append('path')
		.attr('d', shape)
		.attr('fill', 'black')
		.attr('transform', function(d) {
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
	var queryBase = base + '/getRec?token=' +spotifyToken + '&limit=' + 50 + '&artists=' + similarArtist;
	var queryTrackAtrributes = '&target_acousticness=' + targetValues.acousticness + '&target_danceability=' + targetValues.danceability
		+ '&target_energy=' + targetValues.energy + '&target_valence=' + targetValues.valence + '&target_instrumentalness='+targetValues.instrumentalness
		+'&target_tempo='+targetValues.tempo+'&userId=' + userID + '&likedSongs=' + likedSongs.length + '&dislikedSongs=' + dislikedSongs.length;
	var query = queryBase.concat(queryTrackAtrributes);
	$.getJSON( query , function( dataObject ) {
		if (dataObject.error){
			addInteraction("recommendations",'error', 'error')

			window.location.href = base + '/error';
		}
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
			//Don't do anything if preview is null or already appended 10 songs or already liked
			var index = likedSongs.indexOf(d.id);
			var indexDisliked = dislikedSongs.indexOf(d.id)
			if(index === -1 && indexDisliked === -1 && d.preview_url !== null && nbAppendedArtists < totalNbOfRecommendations){
				nbAppendedArtists ++;
				var artist = d.artists[0]['name'];
				var artistId = d.artists[0]['id'];
				var image = "image"
				appendSong(d.id, similarArtist, d.name, artist, d.duration_ms, d.external_urls['spotify'], d.preview_url, image, appendedSongslist);



				// //	get the image of the artist
				// var query = '/getArtist?token=' + spotifyToken + '&artistId=' + artistId;
				// $.getJSON(query, function (dataObject) {
				// 	if (dataObject.error){
				// 		addInteraction("getArtist",'error', 'error')
				// 		window.location.href = base + '/error';
				// 	}
				// 	var data = dataObject.data;
				// 	var image = getArtistImage(data);
				// 	appendSong(d.id, similarArtist, d.name, artist, d.duration_ms, d.external_urls['spotify'], d.preview_url, image, appendedSongslist);
				// })
			}
		});
	});
}

/**
 *
 * @param trackId
 * @param similarArtist
 * @param title
 * @param artist
 * @param duration
 * @param url
 * @param preview
 * @param image
 * @param appendedSongslist
 */
function appendSong(trackId, similarArtist, title, artist, duration, url, preview, image, appendedSongslist) {
	var query = base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist;
	$.getJSON(query, function (song) {
		if( song === null){
			//Song not in database
			addSong(trackId, similarArtist, title, artist, duration, url, preview, image, appendedSongslist);
		}
		else{
			appendRecommendationsArtist(song, similarArtist, appendedSongslist)
		}
	});
}



function addSong(trackId, similarArtist, title, artist, duration, url, preview, image, appendedSongslist) {
	var query = base + '/getAudioFeaturesForTrack?token=' +spotifyToken + '&trackId=' + trackId;
	//get features of song
	$.getJSON( query , function( dataObject ) {
		if (dataObject.error){
			addInteraction("audiofeatures",'error', 'error')
			console.log('starting to crash', dataObject)
			window.location.href = base + '/error';
		}
		var data = dataObject.data;
		//add song to database
		var attributes = '&acousticness=' + data.acousticness + '&energy=' + data.energy
		+'&danceability=' + data.danceability + '&instrumentalness=' + data.instrumentalness
		+'&tempo=' + data.tempo + '&valence=' + data.valence ;
		var trackInfo = '&similarArtist=' + similarArtist + '&title=' + title
			+ '&artist=' + artist + '&duration=' + duration + '&url=' + url + '&preview=' + preview+ '&image=' + image;
		//add song and append to recommendedsongs
		var query1 = base + '/addSong?trackId=' + trackId + attributes + trackInfo ;
		$.getJSON(query1, function (message) {
			//append song to recommendations
			$.getJSON(base + '/getSong?trackId=' + trackId + '&similarArtist=' + similarArtist, function (song) {
				appendRecommendationsArtist(song, similarArtist, appendedSongslist)
			})
		})
	})

}





