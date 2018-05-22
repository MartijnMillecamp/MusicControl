// Based on http://bl.ocks.org/jfreels/6871643
// http://bl.ocks.org/weiglemc/6185069

$(document).ready(function() {
	console.log('ready')
	var xAxisValue = $('#x option:selected').text().toLowerCase();
	$('#x').change(function () {
		xChange($('#x option:selected').text().toLowerCase())
	});
	var yAxisValue = $('#y option:selected').text().toLowerCase();
	$('#y').change(function () {
		yChange($('#y option:selected').text().toLowerCase())
	});



	$(document).on('click', ".artistDiv", function(event) {
		updateScatterplot(recommendedSongs)
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
		.append('text') // X-axis Label
		.attr('id','xAxisLabel')
		.attr('y',-10)
		.attr('x',w)
		.attr('dy','.71em')
		.style('text-anchor','end')
		.style('fill','white')
		.text(xAxisValue);
// Y-axis
	svg.append('g')
		.attr('class','axis')
		.attr('id','yAxis')
		.call(yAxis)
		.append('text') // y-axis Label
		.attr('id', 'yAxisLabel')
		.attr('transform','rotate(-90)')
		.attr('x',0)
		.attr('y',5)
		.attr('dy','.71em')
		.style('text-anchor','end')
		.text(yAxisValue);

});

var margin = { top: 50, right: 50, bottom: 50, left: 50 }
var h = 500 - margin.top - margin.bottom;
var w = 500 - margin.left - margin.right;

var colorScale = d3.scale.category20();
var xScale = d3.scale.linear()
	.domain([0,100])
	.range([0,500]);

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
	yScale // change the yScale
		.domain([0,100]);
	yAxis.scale(yScale) // change the yScale
	d3.select('#yAxis') // redraw the yAxis
		.transition().duration(1000)
		.call(yAxis);
	d3.select('#yAxisLabel') // change the yAxisLabel
		.text(value)
	d3.selectAll('circle') // move the circles
		.transition().duration(1000)
		.delay(function (d,i) { return i*100})
		.attr('cy',function (d) { return yScale(d[value]) })
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
	d3.selectAll('circle') // move the circles
		.transition().duration(1000)
		.delay(function (d,i) { return i*100})
		.attr('cx',function (d) { return xScale(d[value]) })
}

function updateScatterplot(data){
	var xAxisValue = $('#x option:selected').text().toLowerCase();
	var yAxisValue = $('#y option:selected').text().toLowerCase();

	// change string (from CSV) into number format
	data.forEach(function (d) {
		d.energy = +d.energy * 100;
		d.instrumentalness = +d.instrumentalness * 100;
		d.acousticness = +d.acousticness * 100;
		d.tempo = +d.tempo;
		d.valence = +d.valence * 100;
		d.danceability = +d.danceability * 100
	});
	var svg = d3.select('#svgScatter');
	var circles = svg.selectAll("circles")
		.data(data, function(d) {
			return d.trackId; });
	//New data
	circles
		.enter()
		.append('circle')
		.attr('cx',function (d) {return xScale(d[xAxisValue]) })
		.attr('cy',function (d) {return yScale(d[yAxisValue]) })
		.attr('r','10')
		.attr('stroke','white')
		.attr('stroke-width',1)
		.attr('fill',function (d) { return colorScale(d.artist) });

	//old data
	circles
		.exit()
		.transition()
		.duration(750)
		.attr('cx',function (d) {
			console.log(d)
			return xScale(d[xAxisValue])
		});
	// .remove();
};