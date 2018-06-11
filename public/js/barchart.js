

function makeBarchart(trackId, dataSong) {
	var svg = d3.select("#popUpSvg_" + trackId),
		margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = 500 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var xScale = d3.scale.ordinal().rangeRoundBands([0, width],0.1),
		yScale = d3.scale.linear().range([height,0]);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	dataSong.forEach(function (d) {
		d.value = +d.value;
	});

	xScale.domain(dataSong.map(function (d) {
		return d.name;
	}));
	yScale.domain([0, 100]);

	svg.append("g")
		.selectAll(".barAttr")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", function(d){ return xScale(d.name) + margin.left; })
		.attr("y", function(d){ return yScale(d.value) + margin.top; })
		.attr("height", function(d){ return height - yScale(d.value); })
		.attr("width", function(){ return xScale.rangeBand(); })
		.attr('fill', function (d) {
			return getAttributeColor(d.name)
		})

}


