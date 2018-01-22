var spotifyToken = $.cookie('spotify-token')
var refreshToken = $.cookie('refresh-token')
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

	$(document).on('click', "#calculateButton", function(event) {
		$(this).attr("disabled", "disabled");

		if(selectedArtists.length > 0){

			//ripple effect
			event.preventDefault();

			var $div = $('<div/>'),
				btnOffset = $(this).offset(),
				xPos = event.pageX - btnOffset.left,
				yPos = event.pageY - btnOffset.top;

			$div.addClass('ripple-effect');
			var $ripple = $(".ripple-effect");

			$ripple.css("height", $(this).height());
			$ripple.css("width", $(this).height());
			$div
				.css({
					top: yPos - ($ripple.height()/2),
					left: xPos - ($ripple.width()/2),
					background: $(this).data("ripple-color")
				})
				.appendTo($(this));

			window.setTimeout(function(){
				$div.remove();
			}, 1000);

			$('.warningSelect').css("display", "none");
			var myNode = document.getElementById("recList");
			while (myNode.firstChild) {
				myNode.removeChild(myNode.firstChild);
			}
			getRecommendations();
		}
		else{
			$('.warningSelect').css("display", "block");
			$("#calculateButton").removeAttr("disabled");

		}


	});


});


function getRecommendations() {
	var queryBase = '/getRec?token=' + spotifyToken + '&limit=25&artists=' + selectedArtists;
	var queryTrackAtrributes = '&target_acousticness=' + acousticness + '&target_danceability=' + danceability
		+ '&target_energy=' + energy + '&target_valence=' + valence + '&target_popularity='+popularity;
	var query = queryBase.concat(queryTrackAtrributes);
	// jQuery AJAX call for JSON
	$.getJSON( query , function( data ) {
		console.log(data)
		data.forEach(function (d) {
			var track = d.name;
			var artist = d.artists[0].name;
			$( "#recList" ).append('<div class="recDiv" id="' + d.id + '"></div>');
			$( "#" + d.id + "" ).append('<div class="recDivTrack" id="track' + d.id + '">' + track  + '</div>')
			$( "#" + d.id + "" ).append('<div class="recDivArtist" id="' + d.id + '">' + artist  + '</div>')

		})
	});
	setTimeout('$("#calculateButton").removeAttr("disabled")', 1500);

}