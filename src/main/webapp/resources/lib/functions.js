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

	// indexApp.controller('data_retrieve_controller',function($scope){
	//     d3.json('plane_data.json',function(err,data){
	//         if(err){
	//             throw err;
	//         }s
	//         $scope.data=data;
	//         $scope.$apply();
	//     });
	// });

	//var simpleJSONStream = [{"id":32041},{"id":38757},{"id":38756},{"id":32077},{"id":32227},{"id":32229},{"id":32232},{"id":32235},{"id":32296},{"id":32303},{"id":32305},{"id":32387},{"id":32469},{"id":32470},{"id":32507},{"id":32508},{"id":32514},{"id":32515},{"id":32521},{"id":32522},{"id":32523},{"id":32529},{"id":32530},{"id":32554},{"id":32560},{"id":32561},{"id":32715},{"id":32721},{"id":32722},{"id":32804},{"id":32819},{"id":32826},{"id":32825},{"id":15595},{"id":15579},{"id":23337}];

	indexApp.controller('getKRValue',function($scope,$http){
		$scope.kvalue=5;
		$scope.rvalue=5000;
		$scope.oldK=0;
		$scope.oldR=0;
		$scope.updateKRValue=function(){
			console.log('range value has changed to :'+'K:'+$scope.kvalue+'R:'+$scope.rvalue);
			if($scope.rvalue===$scope.oldR && $scope.kvalue===$scope.oldK){
				console.log('K and R are the same as previous request');
			}
			else{
				$http.get('http://localhost:8080/method1?k='+$scope.kvalue+'&r='+$scope.rvalue).
				success(function(data) {
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
				}).
				error(function(data) {
					// d3.selectAll('.dataPoint')
					// .style('fill',function(d) {
					//                 return (d.distanceList[$scope.kvalue-1] > +$scope.rvalue)
					//                         ? 'red' : '#1f77b4';});
					console.log("Fail getting outlier data");

					//var dataPoint = d3.selectAll('.dataPoint');
					//var hashtable = {};
					//simpleJSONStream.forEach(function(element){
					//     var key  = element.id.toString();
					//    hashtable[key]=true;
					//});
					//console.log(hashtable);
					//dataPoint.style('fill',function(d){
					//    key = d.point.id.toString();
					//    var outlier = key in hashtable;
					//    if(outlier){
					//        console.log('outlier');
					//    }
					//    return outlier ? 'red':'#1F77B4';
					//});
				});
			}
			$scope.oldK=$scope.kvalue;
			$scope.oldR=$scope.rvalue;
		};
	});

	indexApp.directive('stringToNumber', function() {
		return {
			require: 'ngModel', 
			resctric:'C',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(value) {
					return '' + value;
				});
				ngModel.$formatters.push(function(value) {
					return parseFloat(value, 10);
				});
			}   
		};
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
			var xValue = function(d) { return d.point.lat;}, // data -> value
			xScale = d3.scale.linear().range([0, width]), // value -> display
			xMap = function(d) { return xScale(xValue(d));}, // data -> display
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");

			// setup y
			var yValue = function(d) { return d.point.lon;}, // data -> value
			yScale = d3.scale.linear().range([height, 0]), // value -> display
			yMap = function(d) { return yScale(yValue(d));}, // data -> display
			yAxis = d3.svg.axis().scale(yScale).orient("left");

			// setup zoom
			var zoom = d3.behavior.zoom()
			.scaleExtent([1,10])
			.on("zoom", zoomed);

			// setup zoomed function
			function zoomed() {
				var t = d3.event.translate,
				s = d3.event.scale;
				//comstrain zoomed window to bounds of graph
				t[0] = Math.max(-width*(s-1), Math.min(t[0], 0)); 
				t[1] = Math.max(-height*(s-1), Math.min(t[1], 0));
				zoom.translate(t);

				//redraws axis
				svg.select(".x.axis").call(xAxis);
				svg.select(".y.axis").call(yAxis);

				//redraws points
				svg.selectAll('.dataPoint')
				.attr("cx", function(d, i) { return xMap(d); })
				.attr("cy", function(d, i) { return yMap(d); });
			}

			// setup fill color
			var cValue = function(d) { return d.type;},
			color = d3.scale.category10();

			// add the graph canvas to the body of the webpage
			var svg = d3.select(element[0]).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(zoom);

			svg
			.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr('fill','#ddd')
			.style("pointer-events", "all");

			svg.append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);

			// add the tooltip area to the webpage
			var tooltip = d3.select(element[0]).append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

			// load data
			d3.json("resources/lib/dataplane.json", function(error, data) {
//				data.forEach(function(element){
//				// change string (from JSON) into number format
//				element.point.lat= +element.point.lat;
//				element.point.lon = +element.point.lon;
//				element.point.id=+element.point.id;
//				});


				console.log("Finish loading data plane values");

				xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
				yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

				zoom.x(xScale).y(yScale);

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
				.classed('dataPoint', true)
				.attr("clip-path", "url(#clip)")
				.attr('id',function(d){return'id'+d.point.id;})
				.on("mouseover", function(d) {
					tooltip.transition()
					.duration(200)
					.style("opacity", 1.4);
					tooltip.html("ID: "+ d.point.id + "<br/> (" + xValue(d)
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
		};
	});



})();