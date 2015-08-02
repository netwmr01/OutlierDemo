angular.module('indexApp').controller('boundaryCtrl',['$scope', '$window','updateBoundaryGraph',function($scope,$window,updateBoundaryGraph){

	/**zooms the boundary graph to the selected area 
	 */
    $scope.zoom = function(){
        console.log('ZOOM');
        var selectionRect = d3.selectAll('.selectionRect');
        var minx = Number(selectionRect.attr('x'));
        var miny = Number(selectionRect.attr('y'));
        var maxx = Number(minx) + Number(selectionRect.attr('width'));
        var maxy = Number(miny) + Number(selectionRect.attr('height'));
        console.log([minx,miny,maxx,maxy]);

        minx = Math.round(boundaryX.invert(minx));
        miny = Math.round(boundaryY.invert(miny));
        maxx = Math.round(boundaryX.invert(maxx));
        maxy = Math.round(boundaryY.invert(maxy));
        var x = miny;
        miny=maxy;
        maxy=x;
        console.log([minx,maxx,miny,maxy]);

        // boundaryX.domain([minx,maxx]);
        // boundaryY.domain([miny,maxy]);

        // svg.select(".x.axis").call(xAxis);
        // svg.select(".y.axis").call(yAxis);
    };

    /** resets the selection in the boundary graph
     */
    $scope.resetBSelection =function(){
        var selectionRect = d3.selectAll('.selectionRect');
        selectionRect
            .attr('x',0)
            .attr('y',0)
            .attr('width',0)
            .attr('height',0);

    };  


    /** draws the boundary lines
     * @param  {event} event - event information
     * @param  {object} args - aruments passed by event
     */
    function drawBoundaries(event, args){
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

    // listens for the updateBoundary event in $scope
    $scope.$on('updateBoundary', drawBoundaries);

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
}]);
