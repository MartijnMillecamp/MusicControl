

function makeBarchart(dataSong, svgId, svgWidth, svgHeight) {
	var svg = d3.select("#" + svgId),
		margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

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

	svg.selectAll(".labelBar")
		.data(dataSong)
		.enter()
		.append("text")
		.attr("class","labelBar")
		.attr("x", (function(d) { return xScale(d.name) + margin.left + xScale.rangeBand() / 2 ; }  ))
		.attr("y", function(d) { return getYPositionLabel(d) })
		.attr("dy", ".75em")
		.attr('text-anchor', 'middle')
		.attr('fill', function (d) {
			return getColorLabel(d)
		})
		.text(function(d) { return d.value; });

	function getColorLabel(d){
		var color = "#424242";
		var yPosition = yScale(d.value) + margin.top +10;
		if(yPosition > height - 10){
			color = 'white';
		}
		return color;
	}
	function getYPositionLabel(d){
		var yPosition = yScale(d.value) + margin.top +10;
		if(yPosition > height - 10){
			yPosition = height-20;
		}

		return yPosition;


	}

}


