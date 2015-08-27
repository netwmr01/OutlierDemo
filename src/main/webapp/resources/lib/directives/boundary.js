angular.module('indexApp').directive('boundary', 
    ['$window', 'updateBoundaryGraph', 'getConstLiers', 'updateKR',
    function($window,updateBoundaryGraph, getConstLiers, updateKR){
    return{
        restrict:'E',
        link: link,
        scope: { data: '=' }
    };

    function link(scope,element,attr){

        var margin, height,width;
        var x,y,xAxis,yAxis,svg;
        var d3 = $window.d3;
        var zoom,clipPath;
        var selection = {'point1':[0,0], 'point2':[0,0]};
        var selectionRect;
        var shiftDown=false;

        setParameters();
        plotGraph();

        //sets the parameters
        function setParameters(){
            // magins and dimensions of the svg
            var paneDimensions= d3.select('.left.paneContent').node().getBoundingClientRect();
            margin = {top: 20, right: 40, bottom: 40, left: 40};
            width = paneDimensions.width - margin.left - margin.right;
            height = paneDimensions.height- 42 - margin.top - margin.bottom;

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

            //creates drag object
            var drag = d3.behavior.drag()
                .on("drag", dragmove);

            //defines the drag behaviour
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
                        .attr('x', d3.min([selection.point1[0],selection.point2[0]]))
                        .attr('y', d3.min([selection.point1[1],selection.point2[1]]))
                        .attr('width', Math.abs((selection.point2[0]-selection.point1[0])))
                        .attr('height',Math.abs((selection.point2[1]-selection.point1[1])));

                    // console.log(selection);
                }
            }

            // Adds the svg canvas
            svg = d3.select(element[0])
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append("svg")
                // .attr("preserveAspectRatio", "xMinYMin meet")
                // .attr("viewBox", "0 0 "+ paneDimensions.width +' '+ paneDimensions.height)
                .attr("viewBox", "0 0 "+ (width + margin.left + margin.right)+
                    ' '+ (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true)
                .append("g")
                .classed('boundaryGraph',true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(drag)
                .style("pointer-events", "all");
                // .call(zoom);

            // creates graph backdrop
            svg
                .append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr('fill','#ddd')
                .attr('stroke','black')
                ;


            svg.append('g')
                .style("pointer-events", "all")
                .classed('boundaryBackground',true)
				.attr('opacity', 1);

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
                if(d3.event.keyCode === 16){
                    shiftDown=  true;
                }
            })
            .on('keyup', function(){
                if(d3.event.keyCode === 16){
                    shiftDown = false;
                }
            });

        //updates the axis of boundary graph
        scope.$on('updatedBoundaryScales',function(){
           var scales = updateBoundaryGraph.getScales();
           x = scales.x;
           y = scales.y;
           xAxis.scale(x);
           yAxis.scale(y);

           d3.select('.boundary.x.axis')
            .call(xAxis);
           d3.select('.boundary.y.axis')
            .call(yAxis);
        });

        // creates interations with the boundary canvas
        svg.on('mousedown', function(){
            // console.log('selection mousedown');
            // console.log(selection);

            // console.log(shiftDown);
            if(shiftDown){
            }else{
                //gets the location of the mouse when clicked
                var mousePoint= d3.mouse(this);
                mousePoint[0] = Math.max(0, Math.min(mousePoint[0], width));
                mousePoint[1] = Math.max(0, Math.min(mousePoint[1], height));
                selection.point1 =selection.point2=mousePoint;
                console.log(mousePoint);

                // sets starting point of selection rect
                selectionRect
                  .attr("x", selection.point1[0])
                  .attr('y', selection.point1[1])
                  .attr('width', 0)
                  .attr('height',0);
                  console.log('boundary graph clicked');
              }
        })
        .on('mouseup',function(){
            if(shiftDown){
                // sets the kr values
                var mousePoint= d3.mouse(this);
                var k = Math.round(x.invert(mousePoint[0]));
                var r = Math.round(y.invert(mousePoint[1]));

                // console.log('K: '+k+' R:'+r);

                // sets the kr values and updates points
                updateKR.setKR(k,r);

            }else{
                // sorts the x and y boundaries
                var rangex =d3.extent([selection.point1[0],selection.point2[0]]).map(x.invert);
                var rangey =d3.extent([selection.point1[1],selection.point2[1]]).map(y.invert);

                // flips and rouonds the y boundaries
                var temp = Math.round(rangey[0]);
                rangey[0] = Math.round(rangey[1]);
                rangey[1] = temp;

                // roundsa the x boundaries
                rangex[0] = Math.round(rangex[0]);
                rangex[1] = Math.round(rangex[1]);

                // updates the constant liers
                // console.log([rangex[0],rangex[1], rangey[0], rangey[1]]);
                getConstLiers.update(rangex[0],rangex[1], rangey[0], rangey[1]);
            }

        });

        

        // creates axis, sets the scalese in updateBoundary service, and updates the boundaryGraph 
        function plotGraph(){
            createAxis();
            // zoom.x(x).y(y);
            // console.log('setting scales');
            // console.log(x);
            // console.log(y);
            updateBoundaryGraph.setScales(x,y);
        }

        // creates axis
        function createAxis(){
            // Set the domain of data
            x.domain([0, 10.5]);
            y.domain([0,100]);

            // Add the X Axis
            svg.append("g")
                .attr("class", "boundary x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            // Add the Y Axis
            svg.append("g")
                .attr("class", "boundary y axis")
                .call(yAxis);

            // X axis label
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width - 30)
                .attr("y", height + 30)
                .text("k value");

            // Y axis label
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -40)
                .attr("x", 0)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("r value");

        }
    }
}]);