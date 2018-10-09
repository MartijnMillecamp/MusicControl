// Based on http://bl.ocks.org/jfreels/6871643
// http://bl.ocks.org/weiglemc/6185069



// var shapeList = ['cross', 'circle', 'triangle-up', 'square', 'diamond','triangle-down']

$(document).ready(function() {
	//Get the values of the Axes
	$('#x').change(function () {
		var valueX = $('#x option:selected').text().toLowerCase();
		var valueY = $('#y option:selected').text().toLowerCase();
		xChange(valueX, valueY);
		//disable the value in the other dropdown
		$('#y_' + valueX).attr('disabled', 'disabled')
			.siblings().removeAttr('disabled');
		$('select').niceSelect('update');

		addInteraction('x', 'change', valueX);


	});
	$('#y').change(function () {
		var valueX = $('#x option:selected').text().toLowerCase();
		var valueY = $('#y option:selected').text().toLowerCase();
		yChange(valueX, valueY)
		//disable the value in the other dropdown
		$('#x_' + valueY).attr('disabled', 'disabled')
			.siblings().removeAttr('disabled');
		$('select').niceSelect('update');

		addInteraction('y', 'change', valueX);

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
		;
// Y-axis
	svg.append('g')
		.attr('class','axis')
		.attr('id','yAxis')
		.call(yAxis)
		.append('text')
		;

});

var margin = { top: 20, right: 50, bottom: 50, left: 50 };
var h = 500 - margin.top - margin.bottom;
var w = 500 - margin.left - margin.right;


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




function yChange(valueX, valueY) {
	drawTarget(valueX,valueY)
	d3.selectAll('.shape') // move the circles
		.transition().duration(1000)
		.attr('transform',function(d){
			var xCenter = xScale(d[valueX]) + margin.left;
			var yCenter = yScale(d[valueY]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; });
	d3.selectAll('.hoverShape') // move the circles
		.transition().duration(1000)
		.attr('transform',function(d){
			var xCenter = xScale(d[valueX]) + margin.left;
			var yCenter = yScale(d[valueY]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; });
	d3.selectAll('.target')
		.transition().duration(500)
		.attr('transform', function (d) {

		})
}

function xChange(valueX, valueY) {
	drawTarget(valueX,valueY)

	d3.selectAll('.shape') // move the circles
		.transition().duration(1000)
		.attr('transform',function(d){
			var xCenter = xScale(d[valueX]) + margin.left;
			var yCenter = yScale(d[valueY]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; });
	d3.selectAll('.hoverShape') // move the circles
		.transition().duration(1000)
		.attr('transform',function(d){
			var xCenter = xScale(d[valueX]) + margin.left;
			var yCenter = yScale(d[valueY]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; });
}



function updateScatterplot(data, similarArtist) {
	if(data===null){
		return
	}
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


	var xAxisValue = $('#x option:selected').text().toLowerCase();
	console.log(xAxisValue)
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

	var hoverShapes = svg.selectAll(".hoverShape")
		.data(data, function(d) {
			return d._id; });

	//update
	shapes
		.attr('class', function (d,i) {
			if(i >= nbOfRecommendations && d.similarArtist === similarArtist){
				return "shape invisible" + getArtistShape(d.similarArtist)
			}
			else if(d.similarArtist === similarArtist){
				return "shape " + getArtistShape(d.similarArtist)
			}
			else{
				return 'remove'
			}
		})


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
		.attr('class', function (d,i) {
			if(i >= nbOfRecommendations){
				return "shape invisible" + getArtistShape(d.similarArtist)
			}
			else{
				return "shape " + getArtistShape(d.similarArtist)
			}

		})
		.on('mouseover', function (d) {
			$(this).addClass('selected');
			$('#hoverShape_' + d.trackId).removeClass('hidden');
			$('#permanent_' + d.trackId)
				.addClass('selectedRecommendation')
				.effect('shake');
			$('#songLink_' + d.trackId).addClass('selectedRecommendation');
		})
		.attr('fill', 'none' )
		.attr('stroke','white')
		.attr('stroke-width',1);

	hoverShapes
		.enter()
		.append('path')
		.attr('d', hoverShape)
		.attr('transform',function(d){
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yCenter = yScale(d[yAxisValue]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; })
		.attr('id', function (d) { return 'hoverShape_' + d.trackId})
		.attr('class', function (d) {
			return "hoverShape hidden " + getArtistShape(d.similarArtist)
		})
		.on("mouseleave", function (d) {
			$('#shape_' + d.trackId).removeClass('selected');
			$('#permanent_' + d.trackId).removeClass('selectedRecommendation');
			$('#songLink_' + d.trackId).removeClass('selectedRecommendation');
			$('#hoverShape_' + d.trackId).addClass('hidden');
		})



	//data not represented anymore
	shapes
		.exit()
		.attr('class', function (d) {
			if(!($('#' + d.trackId).hasClass('liked') && d.similarArtist === similarArtist)){
				return "remove"
			}
			else{
				return "shape liked " + getArtistShape(d.similarArtist)
			}
		});

	//Remove all old songs
	d3.selectAll(".remove")
		.transition()
		.call(endall, function() {
			enableAllInput()
		})
		.duration(1000)
		.attr('fill',"grey")
		.attr('opacity',0.5)
		.attr('transform',function(d,i){
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yEnd = h+margin.top + margin.bottom+20;
			return "translate("+xCenter+","+yEnd+")"; })
		.remove();

	drawTarget(xAxisValue, yAxisValue)

}

function drawTarget(xAxisValue, yAxisValue) {
	var svg = d3.select('#svgScatter');
	//target
	d3.selectAll('.target').remove()
	var dataTarget = {
		trackId: "Preference",
		acousticness: targetValues.acousticness * 100,
		energy: targetValues.energy * 100,
		instrumentalness: targetValues.instrumentalness * 100,
		danceability: targetValues.danceability * 100,
		tempo: Math.round((targetValues.tempo - 40)/1.6),
		valence: targetValues.valence * 100
	};


	var dataY = [
		{'x': 0, 'y': dataTarget[yAxisValue]},
		{'x': 100, 'y': dataTarget[yAxisValue]},
	];


	var line = d3.svg.line()
		.x(function(d) { return xScale(d['x']) + margin.left; })
		.y(function(d) { return yScale(d['y']) + margin.top; });

	svg.append('path')
		.attr('d', line(dataY))
		.attr('class', 'target')

	var dataX = [
		{'x': dataTarget[xAxisValue], 'y': 0},
		{'x': dataTarget[xAxisValue], 'y': 100},
	];


	svg.append('path')
		.attr('d', line(dataX))
		.attr('class', 'target')

}

function disableAllInput() {
	$('.artistDiv').addClass('disabled');
	$('.sliders').addClass('disabled');
	$('.slider').prop('disabled', true)
}

function enableAllInput() {
	$('.artistDiv').removeClass('disabled');
	$('.sliders').removeClass('disabled');
	$('.slider').prop('disabled', false)
}

function endall(transition, callback) {
	//if there is an element in the transition
	if(transition[0].length > 0){
		disableAllInput()
	}
	var n = 0;
	transition
		.each(function() { ++n; })
		.each("end", function() { if (!--n) callback.apply(this, arguments); });
}






