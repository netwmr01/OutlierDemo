angular.module('indexApp').directive('boundary', 
    ['$window', 'updateBoundaryGraph', 'getConstLiers', 'updateKR',
    function($window,updateBoundaryGraph, getConstLiers, updateKR){
    return{
        restrict:'E',
        link: function(scope,element,attr){

            var margin, height,width;
            var x,y,xAxis,yAxis,svg;
            var d3 = $window.d3;
            var zoom,clipPath;
            var selection = {'point1':[0,0], 'point2':[0,0]};
            var selectionRect;
            var shiftDown=false;

            setParameters();
            plotGraph();

            function setParameters(){
                // magins and dimensions of the svg
                margin = {top: 20, right: 20, bottom: 30, left: 40};
                width = 500 - margin.left - margin.right;
                height = 500 - margin.top - margin.bottom;

                // Set the ranges
                x = d3.scale.linear().range([0, width]);
                y = d3.scale.linear().range([height, 0]);


                // Define the axes
                xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(11)
                    .innerTickSize(-height);

                yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(5)
                    .innerTickSize(-width);

                // //create zoom object
                // zoom = d3.behavior.zoom()
                //     .scaleExtent([1,10])
                //     .on("zoom", zoomed);

                // Adds the svg canvas
                svg = d3.select("boundary")
                    .insert("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .classed('boundaryGraph',true);
                    // .call(zoom);

                    var drag = d3.behavior.drag()
                        .on("drag", dragmove);

                // creates graph backdrop
                svg
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('fill','#ddd')
                    .style("pointer-events", "all")
                    .call(drag);

                // creates the clipping rectangle
                svg.append("clipPath")
                    .attr("id", "clip2")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);
            }

            // creates the kr selector
            svg
            .append('circle')
            .classed('KRSelector', true);

            selectionRect =svg.append("rect")
                            .attr('x',0)
                            .attr('y',0)
                            .attr('width',0)
                            .attr('height',0)
                            .classed('selectionRect', true);

            // toggles shiftDown 
            d3.select('body')
                .on('keydown', function(){
                    if(d3.event.keyCode == 16){
                        shiftDown=  true;
                    }
                })
                .on('keyup', function(){
                    if(d3.event.keyCode == 16){
                        shiftDown = false;
                    }
                });

            // creates interations with the boundary canvas
            svg.on('mousedown', function(){
                // console.log('selection mousedown');
                // console.log(selection);

                // console.log(shiftDown);
                if(shiftDown){
                }else{
                    var mousePoint= d3.mouse(this);
                    mousePoint[0] = Math.max(0, Math.min(mousePoint[0], width));
                    mousePoint[1] = Math.max(0, Math.min(mousePoint[1], height));
                    selection.point1 =selection.point2=mousePoint;
                    console.log(mousePoint);

                    selectionRect
                      .attr("x", selection.point1[0])
                      .attr('y', selection.point1[1])
                      .attr('width', 0)
                      .attr('height',0);
                  }
            })
            .on('mouseup',function(){
                if(shiftDown){
                    var mousePoint= d3.mouse(this);
                    var k = Math.round(x.invert(mousePoint[0]));
                    var r = Math.round(y.invert(mousePoint[1]));

                    // console.log('K: '+k+' R:'+r);

                    // sets the kr values and updates points
                    updateKR.setKR(k,r);

                }else{
                    var rangex =d3.extent([selection.point1[0],selection.point2[0]]).map(x.invert);
                    var rangey =d3.extent([selection.point1[1],selection.point2[1]]).map(y.invert);

                    var temp = Math.round(rangey[0]);
                    rangey[0] = Math.round(rangey[1]);
                    rangey[1] = temp;

                    rangex[0] = Math.round(rangex[0]);
                    rangex[1] = Math.round(rangex[1]);

                    //replace with actuall call
                    // console.log('[minx,maxx,miny,maxy]');
                    console.log([rangex[0],rangex[1], rangey[0], rangey[1]]);
                    getConstLiers.update(rangex[0],rangex[1], rangey[0], rangey[1]);
                }


            });

            //defines the drag movement
            function dragmove(d){
                // console.log(shiftDown);
                if(shiftDown){}
                else{
                    var mousePoint= d3.mouse(this);
                    // console.log(mousePoint);
                    mousePoint[0] = Math.max(0, Math.min(mousePoint[0], width));
                    mousePoint[1] = Math.max(0, Math.min(mousePoint[1], height));
                    // console.log(mousePoint);
                    selection.point2=mousePoint;

                    selectionRect
                        .attr('x', d3.min([selection.point1[0],selection.point2[0]]).toString())
                        .attr('y', d3.min([selection.point1[1],selection.point2[1]]).toString())
                        .attr('width', Math.abs((selection.point2[0]-selection.point1[0])).toString())
                        .attr('height',Math.abs((selection.point2[1]-selection.point1[1])).toString());

                    // console.log(selection);
                }
            }

            // creates axis, sets the scalese in updateBoundary service, and updates the boundaryGraph 
            function plotGraph(){
                createAxis();
                // zoom.x(x).y(y);
                // console.log('setting scales');
                updateBoundaryGraph.setScales(x,y);
                updateBoundaryGraph.update();
            }

            // creates axis
            function createAxis(){
                // Set the domain of data
                x.domain([0, 10.5]);
                y.domain([0,100]);

                // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                // X axis label
                svg.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width - 6)
                    .attr("y", height - 6)
                    .text("k value  ");

                // Y axis label
                svg.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 6)
                    .attr("x", -4)
                    .attr("dy", ".75em")
                    .attr("transform", "rotate(-90)")
                    .text("r value  ");
            // }

            // function zoomed() {
            //     var t = d3.event.translate,
            //         s = d3.event.scale;
            //     t[0] = Math.max(-width*(s-1), Math.min(t[0], 0));
            //     t[1] = Math.max(-height*(s-1), Math.min(t[1], 0));

            //     zoom.translate(t);


            //     svg.select(".x.axis").call(xAxis);
            //     svg.select(".y.axis").call(yAxis);

            //     updateBoundaryGraph();

            //     console.log(zoom.translate());
            // }

        }
    }};
}]);