angular.module('indexApp').controller('datasetCtrl',
    ['$scope', '$http', 'updateBoundaryGraph', function($scope,$http, updateBoundaryGraph){

	// creates an event listener for redrawDataPoints event
    // when event is heard, resets currently marked outliers and marks the outliers
    // for the current and r values
	$scope.$on('redrawDataPoints', function (event, args) {
		var data= args.data;
        // reset current outliers
        d3.selectAll('.dataPoint.outlier')
            .classed('outlier', false);
        //mark outliers
        data.forEach(function(element){
            var sPoint = d3.select('#id'+element.id.toString());
            if(sPoint){
                // console.log(sPoint.data()[0].point.id);
                sPoint.classed('outlier', true);
                // console.log(sPoint.classed('outlier'));
            }
        });

	});

	// creates an event listener for the updateDelselected event
    // when when the event is heard, removes the point from the color domain and 
    // resets the stroke color of the deselected point 
	$scope.$on('updateDeselected', function(event, args){
		var domain = args.domain;
		var deselected = d3.selectAll('.deselected');
        deselected.style('stroke', null);
        deselected.classed('deselected',false);

        deselected.classed('deselected', false);    
        deselected[0].forEach(function(){
            console.log(deselected);
            var dIndex = domain.indexOf(deselected.data()[0].point.id);
            domain[dIndex]='';
            updateBoundaryGraph.setDomain(domain);
        });

	});
		
	$scope.$on('redrawConstLiers', function(event, args){
        var constOut = args.data[0];
        var constIn = args.data[1];

        // console.log(constOut);
        console.log('starting constant outlier');
        
        //reset current constant outliers
        d3.select('.dataPoint.constOut')
            .classed('constOut',false);

        // sets const out
        constOut.forEach(function(element){
            var sPoint = d3.selectAll('#id'+element.id.toString());
            // console.log(sPoint);
            if(sPoint){
                // console.log(sPoint.data()[0].point.id);
                sPoint.classed('constOut', true);
                // console.log(sPoint.classed('constOut'));
            }
        });

        console.log('starting constant inlier');
        // console.log(constIn.length);

        // reset constIn
        d3.select('.dataPoint.constIn')
            .classed('constIn',false);

        // sets constIn
        constIn.forEach(function(element){
            var sPoint = d3.selectAll('#id'+element.id.toString());
            if(sPoint){
                // console.log(sPoint.data()[0].point.id);
                sPoint.classed('constIn', true);
                // console.log(sPoint.classed('constIn'));
            }
        });
        console.log('Finished Constant Liers');
	});
}]);
