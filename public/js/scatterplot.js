// Based on http://bl.ocks.org/jfreels/6871643
// http://bl.ocks.org/weiglemc/6185069
$(document).ready(function() {
	//read in data
	d3.csv("../cereal.csv", function (error, data) {
		var data = recommendedSongs;
		var margin = { top: 50, right: 50, bottom: 50, left: 50 }
		var h = 500 - margin.top - margin.bottom;
		var w = 500 - margin.left - margin.right;

		var xAxisValue = $('#x option:selected').text();
		$('#x').change(function () {
			xChange($('#x option:selected').text())
		});
		var yAxisValue = $('#y option:selected').text();
		$('#y').change(function () {
			yChange($('#y option:selected').text())
		});

		var colorScale = d3.scale.category20();
		var xScale = d3.scale.linear()
			.domain([0,100])
			.range([0,500]);

		var yScale = d3.scale.linear()
			.domain([0,100])
			.range([h,0]);


		// add the graph canvas to the body of the webpage
		var svg = d3.select("#scatterplot").append("svg")
			.attr('height',h + margin.top + margin.bottom)
			.attr('width',w + margin.left + margin.right)
			.append('g')
			.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

		// X-axis
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom');

		// Y-axis
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left');



		// change string (from CSV) into number format
		data.forEach(function (d) {
			d.Energy = +d.Energy;
			d.Instrumentalness = +d.Instrumentalness;
			d.Acousticness = +d.Acousticness;
			d.Tempo = +d.Tempo;
			d.Valence = +d.Valence;
			d.Danceability = +d.Danceability

		});

		var circles = svg.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx',function (d) {return xScale(d[xAxisValue]) })
			.attr('cy',function (d) {return yScale(d[yAxisValue]) })
			.attr('r','10')
			.attr('stroke','white')
			.attr('stroke-width',1)
			.attr('fill',function (d,i) { return colorScale(i) });

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
			.style('color','white')
			.text('Annualized Return')
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
			.text('Annualized Return')

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
	});
})