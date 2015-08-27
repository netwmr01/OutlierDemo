angular.module('indexApp').directive('legend',['legendSet', function(legendSet){
    return{
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };

    function link(scope,element,attr) {
        //creates the legend svg
        var svg = d3.select('legend').append('svg')
            .attr("width", '100%')
            .attr("height", 40)
            .attr('class','legendSVG');
        
        // console.log("started creating legend");
        //sets the default legend to veiw (outlierness)
        legendSet.updateLegend(0);
    }

}]);