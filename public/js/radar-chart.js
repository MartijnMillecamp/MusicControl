// Credits to https://github.com/azole/d3-radar-chart-draggable
var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
      radius: 6, //radius of nodes
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: .85,
      levels: 4, //number of lines
      maxValue: 100, //outer value
      radians: 2 * Math.PI,
    };
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d.map(function(o){return o.value}))); 
    var allAxis = (d.map(function(i, j){return i.axis}));
    var total = allAxis.length;    
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	  //
    d3.select(id).select("svg").remove();
    var g = d3.select(id).append("svg")
	    .attr('class', 'radarChart')
	    .append("g");

    var tooltip;

    drawFrame();
    var maxAxisValues = []; //
    drawAxis();
    var dataValues = [];
    reCalculatePoints();
    
    var areagg = initPolygon();
    drawPoly();

    drawnode();


    function drawFrame(){
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels").data(allAxis).enter().append("svg:line")
         .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
         .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
         .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
         .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
         .attr("class", "line").attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");;
      }
    }
    
    //
    function drawAxis(){
      var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

      axis.append("line")
          .attr("x1", cfg.w/2)
          .attr("y1", cfg.h/2)
          .attr("x2", function(j, i){
            maxAxisValues[i] = {x:cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total)), y:0};
            return maxAxisValues[i].x;
          })
          .attr("y2", function(j, i){
            maxAxisValues[i].y = cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
            return maxAxisValues[i].y;
          })
          .attr("class", "line").style("stroke", "grey").style("stroke-width", "1px");

      axis.append("text").attr("class", "legend")
          .text(function(d){
          	console.log(d)
	          return d
          })
	          .attr("transform", function(d, i){return "translate(0, -10)";})
          .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-20*Math.sin(i*cfg.radians/total);})
          .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))+20*Math.cos(i*cfg.radians/total);});
    }

    //
    function reCalculatePoints(){
      g.selectAll(".nodes")
        .data(d, function(j, i){
          dataValues[i] =
          [
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)),
          ];
        });
      dataValues[d[0].length] = dataValues[0];
    }

    //
    function initPolygon(){
      return g.selectAll("area").data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radarChartArea")
    }

    //
    function drawPoly(){
      areagg.attr("points",function(de) {
          var str="";
          for(var pti=0;pti<de.length;pti++){
            str=str+de[pti][0]+","+de[pti][1]+" ";
          }            
          return str;
        });
    }
    
    //
    function drawnode(){
      g.selectAll(".nodes")
        .data(d).enter()
        .append("svg:circle")
	        .attr("class", "radarChartNode")
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0);})
        .attr("cx", function(j, i){
          return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.axis;})
	      .attr("id", function(j){return j.axis + "Node";})
	      .on('mouseover', function (d){
	        d3.select(this).attr("class", "radarChartNodeHover");
	        g.selectAll("polygon").attr("class","radarChartAreaHover");
	        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
          newY =  parseFloat(d3.select(this).attr('cy')) - 5;
          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(parseInt(d.value));
	        tooltip.style('opacity', 1);

        })
        .on('mouseout', function(){
	        tooltip.transition(300).style('opacity', 0);
	        g.selectAll("polygon").attr("class","radarChartArea");
	        d3.select(this).attr("class", "radarChartNode");
        })
        .call(d3.behavior.drag()
	        .on("drag", move) )     // for drag & drop
	        .on("dragend", dragEnded)
      ;
    }

    //Tooltip
    tooltip = g.append('text');

    function dragEnded() {
	    console.log("dragend");
	    var id = "#" + d.axis + "Node";
	    $(id).attr("class", "radarChartNode");
    }

    function move(dobj, i){
	    d3.select(this).attr("class", "radarChartNodeHover");
	    tooltip.style('opacity', 1);

	    //
	    this.parentNode.appendChild(this);
      var dragTarget = d3.select(this);

      var oldData = dragTarget.data()[0];
      var oldX = parseFloat(dragTarget.attr("cx")) - 300;
      var oldY = 300 - parseFloat(dragTarget.attr("cy"));
      var newY = 0, newX = 0, newValue = 0;
      var maxX = maxAxisValues[i].x - 300;
      var maxY = 300 - maxAxisValues[i].y;

      //if you do not have a slope (vertical)
      if(oldX === 0) {
        newY = oldY - d3.event.dy;
        //Drag outside range
	      if(newY <1 ){
	      	newY = 1
	      }
        if(Math.abs(newY) > Math.abs(maxY)) {
          newY = maxY;
        }
        //Calculate new value
        newValue = (newY/oldY) * oldData.value;
      }
      else
      {
        var slope = oldY / oldX;   //calculate slope
        newX = d3.event.dx + parseFloat(dragTarget.attr("cx")) - 300;

        //drag under minimum
	      if((dobj.sign * newX) <1 ){
		      newX = 1
	      }
        //If you drag outside the chart

        if(Math.abs(newX) > Math.abs(maxX)) {
          newX = maxX;
        }
        newY = newX * slope;

        var ratio = newX / oldX; //
        newValue = ratio * oldData.value;
      }
      
      //
      dragTarget
          .attr("cx", function(){return newX + 300 ;})
          .attr("cy", function(){return 300 - newY;});
      //
      d[oldData.order].value=newValue;
      //
      reCalculatePoints();
      //
      drawPoly();
	    //update global variable
	    updateTrackAttributes()

	    var newTooltipX =  parseFloat(d3.select(this).attr('cx')) - 10;
	    var newTooltopY =  parseFloat(d3.select(this).attr('cy')) - 5;
	    tooltip
		    .attr('x', newTooltipX)
		    .attr('y', newTooltopY)
		    .text(parseInt(newValue));
	    tooltip.style('opacity', 1);
    }

    function updateTrackAttributes(){
    	var data = d;
    	data.forEach(function (axisData) {
		    switch (axisData.axis){
			    case "acousticness":
				    acousticness = axisData.value/100.0;
				    break;
			    case "energy":
				    energy = axisData.value/100.0;
				    break;
			    case "danceability":
				    danceability = axisData.value/100.0;
				    break;
			    case "valence":
				    valence = axisData.value/100.0;
				    break;
			    case "popularity":
				    popularity = parseInt(axisData.value);
				    break;
			    default:
			    	console.log(axisData.axis)
		    }
	    })

    }
  }
};
