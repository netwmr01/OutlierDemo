(function(){
    var app, indexApp;
    indexApp=angular.module('indexApp',['ui.bootstrap']);
    //app=angular.module('hello', ['ui.bootstrap']);
    //
    //var gem = { id: 'Error', content: 0 };
    //
    //app.controller('Hello',
    //    function($scope, $http){
    //        $http.get('http://localhost:8080/greeting').
    //            success(function(data) {
    //                $scope.greeting = data;
    //            }).
    //            error(function(data) {
    //                $scope.greeting =gem;
    //            });
    //    });

    indexApp.controller('TabCtrl',function($scope,$window){
        $scope.tabs = [
            { title:'Comparative Outlier Analytics (Under Construction)', content:'Under Developing' },
            { title:'Parameter Space Exploration (Under Construction)', content:'Under Developing' }
        ];
    });

    indexApp.controller('data_retrieve_controller',function($scope){
        d3.json('plane_data.json',function(err,data){
            if(err){
                throw err;
            }
            $scope.data=data;
            $scope.$apply();
        });
    });
    indexApp.controller('getKRValue',function($scope,$http){
        $scope.kvalue=5;
        $scope.rvalue=5000;
        $scope.updateKRValue=function(){
            console.log('range value has changed to :'+'K:'+$scope.kvalue+'R:'+$scope.rvalue);
            $http.get('http://localhost:8080/method1?k='+$scope.kvalue+'&r='+$scope.rvalue).
                        success(function(data) {
//                            $scope.kvalue = data;
                        	console.log('Data Retrieved'+data);
                        }).
                        error(function(data) {
                            console.log('Fail to Retrieve data');
                        });
        }

    });

    indexApp.directive('dataplane',function(){
        function link(scope,element,attr){
            /**
             * Created by Tommzy on 7/7/2015.
             */
            var data = scope.data;
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 500 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            /*
             * value accessor - returns the value to encode for a given data object.
             * scale - maps value to a visual display encoding, such as a pixel position.
             * map function - maps from data value to display value
             * axis - sets up axis
             */

            // setup x
            var xValue = function(d) { return d.x;}, // data -> value
                xScale = d3.scale.linear().range([0, width]), // value -> display
                xMap = function(d) { return xScale(xValue(d));}, // data -> display
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

            // setup y
            var yValue = function(d) { return d["y"];}, // data -> value
                yScale = d3.scale.linear().range([height, 0]), // value -> display
                yMap = function(d) { return yScale(yValue(d));}, // data -> display
                yAxis = d3.svg.axis().scale(yScale).orient("left");

            // setup fill color
            var cValue = function(d) { return d.type;},
                color = d3.scale.category10();

            // add the graph canvas to the body of the webpage
            var svg = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // add the tooltip area to the webpage
            var tooltip = d3.select(element[0]).append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // load data
            d3.csv("resources/lib/data.csv", function(error, data) {

                // change string (from CSV) into number format
                data.forEach(function(d) {
                    d.x = +d.x;
                    d["y"] = +d["y"];
                    //    console.log(d);
                });

                xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
                yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

                // x-axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("x");

                // y-axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("y");

                // draw dots
                svg.selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 3.5)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .style("fill", function(d) { return color(cValue(d));})
                    .on("mouseover", function(d) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1.4);
                        tooltip.html("ID: "+d["id"] + "<br/> (" + xValue(d)
                            + ", " + yValue(d) + ")")
                            .style("left", (d3.event.layerX + 5) + "px")
                            .style("top", (d3.event.layerY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                // draw legend
                var legend = svg.selectAll(".legend")
                    .data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                //// draw legend colored rectangles
                //legend.append("rect")
                //    .attr("x", width-18)
                //    .attr("width", 18)
                //    .attr("height", 18)
                //    .style("fill", color)
                //    .style("opacity", 1);;
                //
                //// draw legend text
                //legend.append("text")
                //    .attr("x", width - 24)
                //    .attr("y", 9)
                //    .attr("dy", ".35em")
                //    .style("text-anchor", "end")
                //    .text(function(d) { return d;})
            });

        }
        return{
            link: link,
            restrict: 'E',
            scope: { data: '=' }
        }
    });



})();