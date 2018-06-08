// Based on http://bl.ocks.org/jfreels/6871643
// http://bl.ocks.org/weiglemc/6185069



var shapeList = ['cross', 'circle', 'triangle-up', 'square', 'diamond','triangle-down']

$(document).ready(function() {
	//Get the values of the Axes
	var xAxisValue = $('#x option:selected').text().toLowerCase();
	$('#x').change(function () {
		xChange($('#x option:selected').text().toLowerCase())
	});
	var yAxisValue = $('#y option:selected').text().toLowerCase();
	$('#y').change(function () {
		yChange($('#y option:selected').text().toLowerCase())
	});

	$("#xSelected").click(function () {
		$(this).addClass("selected");
		$('#xSelections').removeClass('hidden')
	});

	$(document).ready(function() {
		$('select').niceSelect();
	});


	// add the graph canvas to the body of the webpage
	var svg = d3.select("#chart").append("svg")
		.attr('height',h + margin.top + margin.bottom)
		.attr('width',w + margin.left + margin.right)
		.attr('id', 'svgScatter')
		.append('g')
		.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

	// X-axis
	svg.append('g')
		.attr('class','axis')
		.attr('id','xAxis')
		.attr('transform', 'translate(0,' + h + ')')
		.call(xAxis)
		// .append('text') // X-axis Label
		// .attr('id','xAxisLabel')
		// .attr('y',-10)
		// .attr('x',w)
		// .attr('dy','.71em')
		// .style('text-anchor','end')
		// .style('fill','white')
		// .text(xAxisValue)
		;
// Y-axis
	svg.append('g')
		.attr('class','axis')
		.attr('id','yAxis')
		.call(yAxis)
		.append('text') // y-axis Label
		// .attr('id', 'yAxisLabel')
		// .attr('transform','rotate(-90)')
		// .attr('x',0)
		// .attr('y',5)
		// .attr('dy','.71em')
		// .style('text-anchor','end')
		// .text(yAxisValue)
		;

});

var margin = { top: 20, right: 50, bottom: 50, left: 50 };
var h = 700 - margin.top - margin.bottom;
var w = 700 - margin.left - margin.right;


var xScale = d3.scale.linear()
	.domain([0,100])
	.range([0,w]);

var yScale = d3.scale.linear()
	.domain([0,100])
	.range([h,0]);



// X-axis
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient('bottom');

// Y-axis
var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient('left');




function yChange(value) {
	// d3.select('#yAxisLabel') // change the yAxisLabel
	// 	.text(value);
	d3.selectAll('.shape') // move the circles
		.transition().duration(1000)
		.attr('transform',function(d){
			var xCenter = xScale(d[value]) + margin.left;
			var yCenter = yScale(d[value]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; });
}

function xChange(value) {
	xScale // change the xScale
		.domain([0,100]);
	xAxis.scale(xScale); // change the xScale
	d3.select('#xAxis') // redraw the xAxis
		.transition().duration(1000)
		.call(xAxis)
	d3.select('#xAxisLabel') // change the xAxisLabel
		.transition().duration(1000)
		.text(value)
	d3.selectAll('.shape') // move the circles
		.transition().duration(1000)
		.attr('transform',function(d){
			var xCenter = xScale(d[value]) + margin.left;
			var yCenter = yScale(d[value]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; });
}

function updateScatterplot(data) {
	if(data===null){
		return
	}
	var xAxisValue = $('#x option:selected').text().toLowerCase();
	var yAxisValue = $('#y option:selected').text().toLowerCase();

	// change string (from CSV) into number format
	data.forEach(function (d) {
		d.energy = +d.energy;
		d.instrumentalness = +d.instrumentalness;
		d.acousticness = +d.acousticness;
		d.tempo = +d.tempo;
		d.valence = +d.valence;
		d.danceability = +d.danceability
	});

	var svg = d3.select('#svgScatter');
	var shapes = svg.selectAll(".shape")
		.data(data, function(d) {
			return d._id; });

	// //update
	// shapes
	// 	.attr('class', "update shape");

	var shape = d3.svg.symbol()
		.type(function (d) {
			return getArtistShape(d.similarArtist)
		})
		.size(150);

	var hoverShape = d3.svg.symbol()
		.type(function (d) {
			return getArtistShape(d.similarArtist)
		})
		.size(500);

	//New data
	shapes
		.enter()
		.append('path')
		.attr('d', shape)
		.attr('transform',function(d){
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yCenter = yScale(d[yAxisValue]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; })
		.attr('id', function (d) { return 'shape_' + d.trackId})
		.attr('class', "shape")
		.on("mouseover", function (d) {
			d3.select(this)
				.attr('fill', '#76ed8f')
				.attr('d', hoverShape)
			$('#permanent_' + d.trackId).addClass('selectedRecommendation');
			$('#permanent_' + d.trackId).effect('shake');

			$('#songLink_' + d.trackId).addClass('selectedRecommendation');
		})
		.on("mouseout", function (d) {
			$('#permanent_' + d.trackId).removeClass('selectedRecommendation');
			$('#songLink_' + d.trackId).removeClass('selectedRecommendation');
			d3.select(this)
				.attr('fill', 'none')
				.attr('d', shape)
		})
		.transition().duration(100)
		.attr('fill', 'none' )
		.attr('stroke','white')
		.attr('stroke-width',1);




	//data not represented anymore
	shapes
		.exit()
		.attr('class', "remove")

	//Remove all old songs
	d3.selectAll(".remove")
		.transition().duration(1000)
		.attr('fill',"grey")
		.attr('opacity',0.5)
		.attr('transform',function(d,i){
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yEnd = h+margin.top + margin.bottom+20;
			return "translate("+xCenter+","+yEnd+")"; })
		.remove()
}





