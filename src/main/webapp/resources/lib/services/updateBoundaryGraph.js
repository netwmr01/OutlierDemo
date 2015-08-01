angular.module('indexApp').factory('updateBoundaryGraph', ['$rootScope', function($rootScope){
	var domain = [];
    for(var i = 0; i<20; i++)domain.push('');
    var colors = d3.scale.category20().range();

    //clears the svg canvas
    var boundaryX,boundaryY;
    
    return{
    	// sets the x and y scales for the boundary graph to the inputs x and y
    	setScales : function(x,y){
    		boundaryX = x;
    		boundaryY = y;
    	},

    	getScales :function(){
    		return {x:boundaryX, y:boundaryY};
    	},


    	// sets up the boundaryPoints array and broadcasts the updateBoundary event on the root scope
    	update: function(){
		    var boundaryGraph =d3.select('.boundaryGraph');
	        var selectedPoints = d3.selectAll('.selected');
	        var boundaryPoints = [];
	        // console.log(selectedPoints);

	        // clears the svg canvas
	        boundaryGraph.selectAll(".line").remove();

	        if(!selectedPoints.empty()){
	        	//creates an array of boundary points for each of the selected data points
	            selectedPoints.data().forEach(function(element){
	                var tempArray = [{'X':0,'Y':0,'id':element.point.id}];
	                for(i = 0;i < 10; i++){
	                    tempArray.push({'Y':element.distanceList[i],"X":i+1});
	                }
	                tempArray.push({'X':11,'Y':element.distanceList[9]});
	                boundaryPoints.push(tempArray);

	            });

	            // console.log(boundaryPoints);

	            // creates a d3 line object
	            var line = d3.svg.line()
	                .interpolate("step-after")  
	                .x(function(d) { return boundaryX(d.X); })
	                .y(function(d) { return boundaryY(d.Y); });

	            // broadcasts the updateBoundary event
                $rootScope.$broadcast('updateBoundary', {line:line,domain:domain, colors:colors, boundaryPoints:boundaryPoints});

	            console.log(domain); 
	            console.log('printed: ' +selectedPoints.size() +' points');
	        }
    	},

    	/**
    	 * @param {array} newDomain - the domain to use
    	 */
    	setDomain: function(newDomain){
    		domain = newDomain;
    	}
    };
}]);