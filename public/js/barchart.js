

function makeBarchart(dataSong, trackId, svgWidth, svgHeight, svgId) {

	var 		barHeight        = 20,
		groupHeight      = barHeight * 2,
		gapBetweenGroups = 10,
		spaceForLabels   = 150,
		spaceForLegend   = 100,
		chartWidth       = svgWidth - spaceForLabels - spaceForLegend;
	var chartHeight = barHeight * 12 + gapBetweenGroups * 6;

	var x = d3.scale.linear()
		.domain([0, 100])
		.range([0, chartWidth]);

	var y = d3.scale.linear()
		.range([chartHeight + gapBetweenGroups, 0]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.tickFormat('')
		.tickSize(0)
		.orient("left");

	var chart = d3.select("#" + svgId + trackId)
		.attr("width", svgWidth)
		.attr("height", chartHeight);

	dataSong.forEach(function (d) {
		d.value = +d.value;
	});


	var barBackground =
		chart.selectAll("barBackground")
		.data(dataSong)
		.enter()
			.append("g")
			.attr("transform", function(d, i) {
				return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/2))) + ")";
			});

	// Create rectangles of the correct width and height
	barBackground.append("rect")
		.attr("class", "barBackground")
		.attr("width", chartWidth)
		.attr("height", barHeight - 1)
		.attr('fill', '#424242')
		.attr('rx', function () {
			return barHeight/2
		});

	// Create bars backgroound
	var bar=
		chart.selectAll("barAttr")
			.data(dataSong)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {
				return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/2))) + ")";
			});

	// Create rectangles of the correct width and height
	bar.append("rect")
		.attr("class", "barAttr")
		.attr("width", function (d) {
			return x(d.value)
		})
		.attr("height", barHeight - 1)
		.attr('fill', function (d) {
					return getAttributeColor(d.name)
		})
		.attr('rx', function () {
			return barHeight/2
		})
		.attr('value',function (d) {
			return d.name + ':' + d.value
		})

	// Add text label in bar
	bar.append("text")
		.attr("x", function(d) {
			var xScaleValue = x(d.value) - 30
			return Math.max(xScaleValue, 20)
		})
		.attr("y", barHeight / 2)
		.attr("fill", function (d) {
			return getAttributeLabelColor(d.name, x(d.value))
		})
		.attr("dy", ".35em")
		.text(function(d) { return d.value; });

	// Draw labels
	bar.append("text")
		.attr("class", "label")
		.attr("fill", "white")
		.attr("x", function() { return - 120; })
		.attr("y", groupHeight / 2)
		.attr("dy", ".40em")
		.text(function(d,i) {
			if (i % 2 === 0)
				return d.name;
			else
				return ""
		});

	// Draw legend
	var legendRectSize = 18,
		legendSpacing  = 4;
	// Create bars backgroound
	var legend = [
		{name: "This song"},
		{name: "Attributes"}
		]
	var legend = chart.selectAll('.legend')
		.data(legend)
		.enter()
		.append('g')
		.attr('transform', function (d, i) {
			var height = legendRectSize + legendSpacing;
			var offset = -gapBetweenGroups/2;
			var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
			var vert = i * height - offset;
			return 'translate(' + horz + ',' + vert + ')';
		});

	// legend.append('rect')
	// 	.attr('width', legendRectSize)
	// 	.attr('height', legendRectSize)
	// 	.style('fill', function (d, i) { return 'blue'; });

	legend.append('text')
		.attr('class', 'legend')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.attr('fill', 'white')
		.text(function (d) { return d.name; });








}


function makeMiniBarchart(dataSong, trackId, svgWidth, svgHeight){
	var svg = d3.select("#miniHistogramSvg_" + trackId),
		margin = {top: 2, right: 2, bottom: 2, left: 2},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	var yScale = d3.scale.ordinal().rangeRoundBands([0,height],0.1),
		xScale = d3.scale.linear().range([0,width]);


	dataSong.forEach(function (d) {
		d.value = +d.value;
	});

	yScale.domain(dataSong.map(function (d) {
		return d.name;
	}));
	xScale.domain([0, 100]);

	svg.append("g")
		.selectAll(".barAttr")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", 0)
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", function(d){ return xScale(d.value) })
		.attr('fill', function (d) {
			return getAttributeColor(d.name)
		})
		.attr('rx', function () {
			return yScale.rangeBand()/2
		})
		.attr('data-toggle', 'tooltip')
		.attr('title' , function (d) {
			return d.name + ": " + d.value
		})
	;
}

function makeProfileBarchart(dataSong, svgWidth, svgHeight, svgId ) {
	var svg = d3.select("#" + svgId),
		margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	var yScale = d3.scale.ordinal().rangeRoundBands([0,height],0.1),
		xScale = d3.scale.linear().range([0,width]);

	var tooltip = d3.select('#tooltipProfile' );

	dataSong.forEach(function (d) {
		d.value = +d.value;
	});

	yScale.domain(dataSong.map(function (d) {
		return d.name;
	}));
	xScale.domain([0, 100]);

	svg.append("g")
		.selectAll(".barBackground")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barBackground")
		.attr("x", 0)
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", function(d){ return xScale(100) })
		.attr('fill', '#424242')
		.attr('rx', function () {
			return yScale.rangeBand()/2
		})
		.attr('value',function (d) {
			return d.name + ':' + d.value
		})
		.on('mouseover', function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip
				.html(d.name + ": "  + d.value);
		})
		.on('mouseleave', function () {
			tooltip
				.style('opacity', 0)
		})
	;

	svg.append("g")
		.selectAll(".barAttr")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", 0)
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", function(d){ return xScale(d.value) })
		.attr('fill', function (d) {
			return getAttributeColor(d.name)
		})
		.attr('rx', function () {
			return yScale.rangeBand()/2
		})
		.on('mouseover', function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip
				.html(d.name + ": "  + d.value);
		})
		.on('mouseleave', function () {
			tooltip
				.style('opacity', 0)
		})
	;


}
