function makeRangeBarchart(dataSong, trackId, svgWidth, svgHeight, svgId){
	var svg = d3.select("#" + svgId + trackId),
		margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	svg
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	var yScale = d3.scale.ordinal()
		.domain(dataSong.map(function (d) {
			return d.name;
		}))
		.rangeRoundBands([0,height],0.1);

	var xScale = d3.scale.linear()
		.domain([0, 100])
		.range([0,width]);

	var xScaletempo = d3.scale.linear()
		.domain([0,250])
		.range([0,width]);

	dataSong.forEach(function (d) {
		d.value = +d.value;
		d.min = +d.min;
		d.max = +d.max;

	});

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
			return yScale.rangeBand()/8
		})
		.attr('value',function (d) {
			return d.name + ':' + d.value
		})

	;

	svg.append("g")
		.selectAll(".barAttr")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", function (d) {
			if (d.name === 'tempo'){
				return xScaletempo(d.min)
			}
			else{
				return xScale(d.min)
			}
		})
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", function(d){
			if (d.name === 'tempo'){
				return xScaletempo(d.max - d.min)
			}
			else{
				return xScale(d.max - d.min)
			}
		})
		.attr('fill', function (d) {
			console.log(getColorSlider(d.name))
			return getColorSlider(d.name);
		})
		.attr('rx', function () {
			return yScale.rangeBand()/8
		})
	;


	svg.append("g")
		.selectAll(".barValue")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", function (d) {
			if (d.name === 'tempo'){
				return xScaletempo(d.value)
			}
			else{
				return xScale(d.value)
			}
		})
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", 5)
		.attr('fill', '#ffffff')
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);
	;

	function handleMouseOver(d, i) {  // Add interactivity

		// Use D3 to select element, change color and size
		d3.select(this).attr({
			fill: "#3c8eff",
			width: 10
		});

		// Specify where to put label of text
		svg.append("text").attr({
			id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
			x: function() {
				var margin = 20;
				if (d.value > 90){
					var margin = -40
				}
				if (d.name === 'tempo'){
					return xScaletempo(d.value) + margin;
				}
				else{
					return xScale(d.value) + margin;
				}
			},
			y: function() { return yScale(d.name) + margin.top + yScale.rangeBand() - 5; },
			'font-size': 20
		})
			.text(function() {
				return [d.value];  // Value of the text
			});
	}

	function handleMouseOut(d, i) {
		// Use D3 to select element, change color back to normal
		d3.select(this).attr({
			fill: "#ffffff",
			width: 5,
		});

		// Select text by id and then remove
		d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
	}
}

function makeProfileBarchart(dataSong, svgWidth, svgHeight, svgId ) {
	var svg = d3.select("#" + svgId),
		margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = svgWidth - margin.left - margin.right,
		height = svgHeight - margin.top - margin.bottom;

	svg
		.attr("width", svgWidth)
		.attr("height", svgHeight);

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
	;


}
