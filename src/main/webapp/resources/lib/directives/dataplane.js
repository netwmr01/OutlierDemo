angular.module('indexApp').directive('dataplane',
    ['updateBoundaryGraph','densityMatrix', function(updateBoundaryGraph,densityMatrix){

    return{
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };

    function link(scope,element,attr){
        /**
         * Created by Tommzy on 7/7/2015.
         */
        var data = scope.data;
        var paneDimensions= d3.select('.right.paneContent').node().getBoundingClientRect();
        var margin = {top: 20, right: 40, bottom: 40, left: 40},
            width = paneDimensions.width - margin.left - margin.right,
            height = paneDimensions.height- 42 - margin.top - margin.bottom;
            // console.log(paneDimensions);
        
        // setup x
            var xValue = function(d) { return d.point.lat;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom")
                .innerTickSize(-height);

        // setup y
        var yValue = function(d) { return d.point.lon;}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left")
                .innerTickSize(-width);

        // setup zoom
        var zoom = d3.behavior.zoom()
            .scaleExtent([1,10])
            .on("zoom", zoomed);

        // setup zoomed function
        function zoomed() {
            var t = d3.event.translate,
                s = d3.event.scale;
            //comstrain zoomed window to bounds of graph
            t[0] = Math.max(-width*(s-1), Math.min(t[0], 0));
            t[1] = Math.max(-height*(s-1), Math.min(t[1], 0));
            zoom.translate(t);

            //redraws axis
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            //redraws points
            svg.selectAll('.dataPoint')
                .attr("cx", function(d, i) { return xMap(d); })
                .attr("cy", function(d, i) { return yMap(d); });
        }

        // setup fill color
        var cValue = function(d) { return d.type;},
            color = d3.scale.category10();

        // add the graph svg to the body of the webpage
        var svg = d3.select(element[0])
            .append("div")
            .classed("svg-container", true) //container class to make it responsive
            .append("svg")
            // .attr("preserveAspectRatio", "xMinYMin meet")
            // .attr("viewBox", "0 0 "+ paneDimensions.width +' '+ paneDimensions.height)
            .attr("viewBox", "0 0 "+ (width + margin.left + margin.right)+
                ' '+ (height + margin.top + margin.bottom))
            .classed("svg-content-responsive", true)
            .append("g")
            .classed('dataset',true)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        // sets up graph rectangle
        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr('fill','#ddd')
            .attr('stroke','black')
            .style("pointer-events", "all");

        // sets up clip path
        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // add the tooltip area to the webpage
        var tooltip = d3.select(element[0]).append("div")
            .attr("class", "tooltip")
            .style("left", 0 + "px")
            .style("top", 0 + "px")
            .style("opacity", 0);

        // load data
        d3.json("resources/lib/sampleJSONs/dataplane.json", function(error, data) {
//				data.forEach(function(element){
//				// change string (from JSON) into number format
//				element.point.lat= +element.point.lat;
//				element.point.lon = +element.point.lon;
//				element.point.id=+element.point.id;
//				});

            densityMatrix.setData(data);
            console.log("Finish loading data plane values");

            // sets domain of the scales
            xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
            yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

            zoom.x(xScale).y(yScale);

            // x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label");
                
            // X axis label
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width - 30)
                .attr("y", height + 30)
                .text("Longitude");

            // y-axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)");

                
            // Y axis label
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -40)
                .attr("x", 0)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Latitude");

            // draw dots
            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .classed('dataPoint', true)
                .attr("clip-path", "url(#clip)")
                .attr('id', function(d){return 'id'+d.point.id; })
                .on("mouseover", function(d) {
                    //moves tool tip and makes it visible
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1.4);
                    tooltip.html("ID: "+ d.point.id + "<br/> (" + xValue(d)+
                        ", " + yValue(d) + ")")
                        .style("left", (d3.event.layerX + 5) + "px")
                        .style("top", (d3.event.layerY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    // makes tooltip transparrent
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on('click', function(d){
                    // selects the point to be shown on boundary graph
                    var clickedPoint = d3.select(this);
                    var currentlySelected =clickedPoint.classed('selected');

                    if(currentlySelected) clickedPoint.classed('deselected',true);
                    clickedPoint.classed('selected',!currentlySelected);
                    console.log('Selected Point');
                    updateBoundaryGraph.update();

                });

        });

    }
}]);