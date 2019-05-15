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

	var xScales = {
		'acousticness': xScale,
		'danceability': xScale,
		'duration': d3.scale.linear().domain([0, 600]).range([0,width]),
		'energy': xScale,
		'instrumentalness': xScale,
		'liveness': xScale,
		'loudness':  d3.scale.linear().domain([-50, 10]).range([0,width]),
		'popularity': xScale,
		'speechiness': xScale,
		'tempo':  d3.scale.linear().domain([0, 250]).range([0,width]),
		'valence': xScale
	}







	dataSong.forEach(function (d) {
		d.value = +d.value;
		d.min = +d.min;
		d.max = +d.max;

	});
	//bar background
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

	//bars
	svg.append("g")
		.selectAll(".barAttr")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", function (d) {
			var scale = xScales[d.name];
			return scale(d.min);
		})
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", function(d){
			var scale = xScales[d.name];
			if(d.name === 'loudness'){
				return scale(d.max - d.min - 50);
			}
			else{
				return scale(d.max - d.min);
			}
		})
		.attr('fill', function (d) {
			// return getColorSlider(d.name);
			return "grey"
		})
		.attr('rx', function () {
			return yScale.rangeBand()/8
		})
		.attr('id', function (d, i) {
				return 'bar_' + trackId + "_" + d.name;
		})
		.on("mouseover", function (d,i) {
			handleMouseOverBar(d.name, d.x, d.y, d.value)
		})
		.on("mouseout", function (d) {
			handleMouseOutBar(d.name, d.x, d.y, d.value)
		})
	;

	//values
	svg.append("g")
		.selectAll(".barValue")
		.data(dataSong)
		.enter()
		.append("rect")
		.attr("class", "barAttr")
		.attr("x", function (d) {
			var scale = xScales[d.name];
			return scale(d.value);
		})
		.attr("y", function(d){ return yScale(d.name) + margin.top; })
		.attr("height", function(){ return yScale.rangeBand(); })
		.attr("width", 5)
		.attr('fill', '#ffffff')
		.attr('id', function (d, i) {
			return 'barValue_' + trackId + "_" + d.name;
		})
		.on("mouseover", function (d,i) {
			handleMouseOverValue(d.name, d.x, d.y, d.value)
		})
		.on("mouseout", function (d) {
			handleMouseOutValue(d.name, d.x, d.y, d.value)
		})
	;

	function handleMouseOverBar( name, x, y, value) {
		var color = getColorSlider(name);
		d3.select('#bar_' + trackId + "_" + name).attr('fill', color);
		handleMouseOverValue(name,x,y,value);
	}

	function handleMouseOutBar(name, x, y, value) {
		d3.select('#bar_' + trackId + "_" + name).attr('fill', 'grey');
		handleMouseOutValue(name,x,y,value);
	}

	function handleMouseOverValue(name, x, y, value) {  // Add interactivity

		// Use D3 to select element, change color and size
		d3.select('#barValue_' + trackId + "_" + name).attr({
			fill: "#3c8eff",
			width: 10
		});

		// Specify where to put label of text
		svg.append("text").attr({
			id: "t" + x + "-" + y ,  // Create an id for text so we can select it later for removing on mouseout
			x: function() {
				var margin = 20;
				if (value > 90){
					var margin = -40
				}
				var scale = xScales[name];
				return scale(value) + margin;
			},
			y: function() { return yScale(name) + margin.top + yScale.rangeBand() - 5; },
			'font-size': 20
		})
			.text(function() {
				return [value];  // Value of the text
			});
	}

	function handleMouseOutValue(name, x, y, value) {
		// Use D3 to select element, change color back to normal
		d3.select('#barValue_' + trackId + "_" + name).attr({
			fill: "#ffffff",
			width: 5,
		});

		// Select text by id and then remove
		d3.select("#t" + x + "-" + y ).remove();  // Remove text location
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
