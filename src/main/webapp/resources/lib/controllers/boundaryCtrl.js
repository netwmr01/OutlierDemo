angular.module('indexApp').controller('boundaryCtrl',
    ['$scope', '$window','updateBoundaryGraph', 'densityMatrix', function($scope,$window,updateBoundaryGraph, densityMatrix){


    // creates an event listener for the updateBoundary event
    // when the event is heard, draw the boundaries on the boundary graph
    $scope.$on('updateBoundary', drawBoundaries);

    // creates an event listener for the updateKR event
    // when something changes the kr values, set the kr indicator to the right location
    $scope.$on('updateKR', function(event, args){
        var scales = updateBoundaryGraph.getScales();

        if(scales.x&&scales.y){
            // console.log('reloctation kr selector on boundary graph');
            d3.select('.KRSelector')
                .attr('cx', scales.x(args.k))
                .attr('cy', scales.y(args.r))
                .attr('r', 3);
        }
    });  


    // draws the boundary lines based on the selected dataPoints
    function drawBoundaries(event, args){
        console.log('drawingBoundaries');
        var line = args.line;
        var domain = args.domain;
        var colors = args.colors;
        var boundaryPoints = args.boundaryPoints;
        var boundaryGraph =d3.select('.boundaryGraph');

        boundaryGraph.selectAll(".line")
            .data(boundaryPoints)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr('id',function(d){
                return 'bid'+ d[0].id;
            })
            .attr('stroke',function(d,i){
                var id = d[0].id;
                var index = domain.indexOf(id);
                // console.log(index);
                if(index===-1){
                    var blankIndex =domain.indexOf("");
                    if(blankIndex>-1) {
                        domain.splice(blankIndex, 1, id);
                        index=blankIndex;
                    }else{
                    }
                }

                var tempcolor=colors[index];

                d3.select('#id'+id).style('stroke',tempcolor);

                return tempcolor;
            })
            .attr("clip-path", "url(#clip2)")
            .attr("d", line);
    }

	//zooms the boundary graph to the selected area 
    $scope.zoom = function(){
        //gets the current scales
        var scales= updateBoundaryGraph.getScales();
        var boundaryX=scales.x;
        var boundaryY=scales.y;

        // console.log(scales);

        // console.log('ZOOM');
        // gets the current location of the boundaries of the selection rect
        var selectionRect = d3.selectAll('.selectionRect');
        var minx = Number(selectionRect.attr('x'));
        var miny = Number(selectionRect.attr('y'));
        var maxx = Number(minx) + Number(selectionRect.attr('width'));
        var maxy = Number(miny) + Number(selectionRect.attr('height'));

        // resets the selection rect
        selectionRect
            .attr('x',0)
            .attr('y',0)
            .attr('width',0)
            .attr('height',0);

        // console.log([minx,miny,maxx,maxy]);

        // converst the boundaries from the svg cooordinate to the kr coordinate
        minx = Math.round(boundaryX.invert(minx));
        miny = Math.round(boundaryY.invert(miny));
        maxx = Math.round(boundaryX.invert(maxx));
        maxy = Math.round(boundaryY.invert(maxy));
        var x = miny;
        miny=maxy;
        maxy=x;
        console.log([minx,maxx,miny,maxy]);

        //sets the boundary graph scale's domain to the boundaries of the selection rect
        boundaryX.domain([minx,maxx]);
        boundaryY.domain([miny,maxy]);
        updateBoundaryGraph.setScales(boundaryX,boundaryY);

        //updates teh densityMatrix
        densityMatrix.createDensityMatrix([minx,maxx,miny,maxy]);

        // svg.select(".x.axis").call(xAxis);
        // svg.select(".y.axis").call(yAxis);
    };

    // resets the zoom in the boundary graph
    $scope.resetZoom = function(){
        // gets the default domain and the current scales of the boundary graph
        var domain = updateBoundaryGraph.getDefaultDomain();
        var scales= updateBoundaryGraph.getScales();

        //sets the current scales to the default scales
        var boundaryX=scales.x.domain(domain.x);
        var boundaryY=scales.y.domain(domain.y);
        updateBoundaryGraph.setScales(boundaryX,boundaryY);

        densityMatrix().createDensityMatrix();
    };

    // deselects the currently selected boundary points and clears the boundary graph
    $scope.resetBoundaries = function(){
        d3.selectAll('.selected')
            .classed('selected',false)
            .classed('deselected',true);

        updateBoundaryGraph.update();
    };

    // resets the selection in the boundary graph
    $scope.resetBSelection =function(){
        var selectionRect = d3.selectAll('.selectionRect');
        selectionRect
            .attr('x',0)
            .attr('y',0)
            .attr('width',0)
            .attr('height',0);

    };

    //toggles the background density graph
    $scope.toggleDensityBackground = function(){
        // console.log('hello');

        var densityRectangles = d3.select('.boundaryBackground');
        densityRectangles.attr('opacity',(1-densityRectangles.attr('opacity')));

        // var  rectangles=d3.selectAll('.densityRectangle');
        // rectangles.classed('visible',!rectangles.classed('visible'));
        // console.log('done');
    };

}]);
