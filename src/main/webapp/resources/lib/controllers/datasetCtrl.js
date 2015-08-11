angular.module('indexApp').controller('datasetCtrl',
    ['$scope', '$http', 'updateBoundaryGraph', function($scope,$http, updateBoundaryGraph){

	//creates a listener for updateKR event
	$scope.$on('redrawDataPoints', function (event, args) {
		var data= args.data;

        //reset current outliers
        d3.selectAll('.outlier')
            .classed('outlier', false);
        //mark outliers
        data.forEach(function(element){
            var sPoint = d3.select('#id'+element.id.toString());
            if(sPoint){
                console.log(sPoint.data()[0].point.id);
                sPoint.classed('outlier', true);
                console.log(sPoint.classed('outlier'));
            }
        });

	});

	// when updating the boundary removes the point from the color domain and resets the stroke color of the point 
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
}]);
