angular.module('indexApp').directive('legend', function(){
    return{
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };

    function link(scope,element,attr) {
        var width = 300;
        //legend items
        var legends = [
            {class_name: 'outlier', actual_name: 'Outlier'},
            {class_name: 'dataPoint', actual_name: 'Inlier'},
            {class_name: 'constOut', actual_name: 'Constant Outlier'},
            {class_name: 'constIn', actual_name: 'Constant Inlier'}
        ];

        // console.log("started creating legend");
        var svg = d3.select('legend').append('svg')
            .attr("width", function(){
                return (90+18+ Math.floor((legends.length-1)/2)*120);
            })
            .attr("height", 40);
        
        var legend = svg.selectAll(".legend")
            .data(legends)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                // console.log(i);
                return "translate("+(90+ Math.floor(i/2)*120)+ "," + i%2*20 + ")";
                //return "translate(" + i * 20 + ",90)";
            })
            .on('mousedown', function(){
            	console.log("clicked")
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("class", function (d) {
                return d.class_name +" legendBox";
            });

        // draw legend text
        legend.append("text")
            .attr("dy", "1em")
            .attr('dx', "-5px")
            .style("text-anchor", "end")
            .style("font-size", "12")
            .attr("class", "legendText")
            .text(function (d) {
                return d.actual_name;
            });
    }

});