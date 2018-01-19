

// DOM Ready =============================================================
$(document).ready(function() {
	var d = [
		{axis: "acousticness", value: 50, order:0},
		{axis: "popularity", value: 50, order:1},
		{axis: "danceability", value: 50, order:2},
		{axis: "energy", value: 50, order:3},
		{axis: "valence", value: 50, order:4},
	];


	RadarChart.draw("#modVis", d);


});