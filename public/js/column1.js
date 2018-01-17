var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
console.log(spotifyToken)
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	populateArtistTable();

});

// Functions =============================================================

// Fill table with data
function populateArtistTable() {


	// jQuery AJAX call for JSON
	$.getJSON( '/getArtist?token=' +spotifyToken, function( data ) {

		data.forEach(function (d) {
			// console.log(d.name)
			var artist = d3.select("#infoArtists").append("svg")
				.attr("class","artist")
				.append("g")
				.attr("class", "artist")

			var rect = artist.append("rect")
				.attr("rx", 20)
				.attr("ry", 20);

			artist.append("text")
				.attr("class", "artistname")
				.attr("x", '30%')
				.attr('y', '50%')
				.text(d.name);

			artist.append("svg:image")
				.attr({'xlink:href': '../img/default.jpeg',
				x:'5%',
				y:'25%',
				class: 'artistImage'});
		})
	});
};




// Returns path data for a rectangle with rounded right corners.
// Note: it’s probably easier to use a <rect> element with rx and ry attributes!
// The top-left corner is ⟨x,y⟩.
function rightRoundedRect(x, y, width, height, radius) {
	return "M" + x + "," + y
		+ "h" + (width - radius)
		+ "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
		+ "v" + (height - 2 * radius)
		+ "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
		+ "h" + (radius - width)
		+ "z";
}