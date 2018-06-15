

function makeBarchart(dataSong, trackId, svgWidth, svgHeight) {
	var svg = d3.select("#popUpSvg_" + trackId),
		margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	var yScale = d3.scale.ordinal().rangeRoundBands([0,height],0.1),
		xScale = d3.scale.linear().range([0,width]);

	var tooltip = d3.select('#tooltipBarDiv_' + trackId );




	// svg.append("g")
	// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

	// svg.selectAll(".labelCircle")
	// 	.data(dataSong)
	// 	.enter()
	// 	.append("circle")
	// 	.attr("class","labelCircle")
	// 	.attr("cx", (function(d) { return xScale(d.value) - yScale.rangeBand()/2 }  ))
	// 	.attr("cy", function(d) { return yScale(d.name) + margin.top + yScale.rangeBand()/2})
	// 	.attr("r", function () {return yScale.rangeBand()/2})
	// 	.attr('fill', function (d) {
	// 		return "white"
	// 	})
	// 	.attr('display','none')
	// ;
	//
	// svg.selectAll(".labelValue")
	// 	.data(dataSong)
	// 	.enter()
	// 	.append("text")
	// 	.attr("class","labelValue")
	// 	.attr('dx', function (d) {return xScale(d.value) - yScale.rangeBand()/2 -8})
	// 	.attr('dy', function (d) {
	// 		return yScale(d.name) + margin.top + yScale.rangeBand()/2 + 6
	// 	})
	// 	.text(function (d) {
	// 		return d.value
	// 	})

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

	function tooltip(d){
		console.log(d)
		// Define the div for the tooltip

	}

}


function makeMiniBarchart(dataSong, trackId, svgWidth, svgHeight){
	var svg = d3.select("#miniHistogramSvg_" + trackId),
		margin = {top: 2, right: 2, bottom: 2, left: 2},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	var yScale = d3.scale.ordinal().rangeRoundBands([0,height],0.1),
		xScale = d3.scale.linear().range([0,width]);

	var tooltip = d3.select('#tooltipBarDiv_' + trackId );


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

function makeProfileBarchart(dataSong, svgWidth, svgHeight ) {
	console.log(dataSong)
	var svg = d3.select("#profileSvg"),
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
