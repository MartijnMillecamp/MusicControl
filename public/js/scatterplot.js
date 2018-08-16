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

function xChange(valueX, valueY) {
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

function showPreference() {

}

function updateScatterplot(data) {
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

	var target = d3.svg.symbol()
		.type(function (d) {
			return 'cross'
		})
		.size(150);

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

	var hoverShapes = svg.selectAll(".hoverShape")
		.data(data, function(d) {
			return d._id; });

	//update
	shapes
		.attr('class', function (d,i) {
			if(i >= nbOfRecommendations){
				return "shape invisible" + getArtistShape(d.similarArtist)
			}
			else{
				return "shape " + getArtistShape(d.similarArtist)
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
		.append('path')
		.attr('d', shape)
		.attr('transform',function(d){
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yCenter = yScale(d[yAxisValue]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; })
		.attr('id', function (d) { return 'shape_' + d.trackId})
		.attr('class', function (d,i) {
			if(!$('#' + d.trackId).hasClass('liked')){
				return 'remove'
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
		.attr('stroke','white')
		.attr('stroke-width',1);

	hoverShapes
		.exit()
		.append('path')
		.attr('d', hoverShape)
		.attr('transform',function(d){
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yCenter = yScale(d[yAxisValue]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; })
		.attr('id', function (d) { return 'hoverShape_' + d.trackId})
		.attr('class', function (d) {
			if(!$('#' + d.trackId).hasClass('liked')){
				return 'remove'
			}
			else{
				return "hoverShape " + getArtistShape(d.similarArtist)
			}
		})
		.on("mouseleave", function (d) {
			$('#shape_' + d.trackId).removeClass('selected');
			$('#permanent_' + d.trackId).removeClass('selectedRecommendation');
			$('#songLink_' + d.trackId).removeClass('selectedRecommendation');
			$('#hoverShape_' + d.trackId).addClass('hidden');
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

	//target

	var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("Your Preference");
	console.log(targetValues)
	var dataTarget = [{
		trackId: "Preference",
		acousticness: 20,
		energy: 50,
		instrumentallness: 50,
		danceability: 50,
		tempo: 50,
		valence: 50
	}]

	var targets = svg.selectAll('.target')
		.data(dataTarget, function (d) {
			return d.acousticness
		})

	targets
		.enter()
		.append('path')
		.attr('d', target)
		.attr('transform',function(d){
			console.log(d)
			var xCenter = xScale(d[xAxisValue]) + margin.left;
			var yCenter = yScale(d[yAxisValue]) + margin.top;
			return "translate("+xCenter+","+yCenter+")"; })
		.attr('id', function (d) { return 'shape_' + d.trackId})
		.attr('class', 'target')
		.attr('fill', 'red')
		.attr('stroke','white')
		.attr('stroke-width',1)
		.on("mouseover", function(){
			d3.select(this).append(text)
			return tooltip.style("visibility", "visible");})







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






