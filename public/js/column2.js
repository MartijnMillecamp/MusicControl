

// DOM Ready =============================================================
$(document).ready(function() {
	var d = [
		{axis: "acousticness",sign: 1, value: 50, order:0},
		{axis: "instrumentalness", sign: -1,value: 50, order:1},
		{axis: "danceability",sign: -1, value: 50, order:2},
		{axis: "valence", sign: 1,value: 50, order:3},
		{axis: "energy",sign: 1, value: 50, order:4},
	];


	RadarChart.draw("#modVis", d);

});