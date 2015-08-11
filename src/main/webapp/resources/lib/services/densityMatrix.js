angular.module('indexApp').factory('densityMatrix', 
	['$http','$rootScope', 'updateBoundaryGraph', function($http,$rootScope,updateBoundaryGraph){

	/**
	 *  @var {array} krArray- array of kr values for all data points
	 *  @var {2d array} densityMatrix - 2d matrix consisting of number of outliers in the region
	 *  @var {2d array} densityCorners - upper left corner of the regions
	 */
	var krArray, densityMatrix=[], densityCorners,amountPerArea =[4000,4000,4000,4000,4000,4000,4000,4000,4000,4000];

	// densityCorners= [10,20,30,40,50,60,70,80,90,100];

	// for(var k = 0;k<10;k++){
	// 	densityMatrix.push([0,0,0,0,0,0,0,0,0,0]);
	// }
	// console.log('densityCorners');
	// console.log(densityCorners);

	var colorScale = d3.scale.linear()
    	.range(['lightgreen', 'darkgreen']) // or use hex values
    	.domain([0, 3000]);
	var scales,maxGraphR ;

	function createDensityMatrix(args){
		scales = updateBoundaryGraph.getScales(); 
		// console.log(scales);
		maxGraphR = scales.y.domain()[1];
		// console.log(maxGraphR);
		var rValues;
		if(args){
			$http.get('http://localhost:8080/getKSortedListRange?kmin='+
                       args[0][0]+'&kmax='+args[0][1]+'&rmin='+args[1][0]+'&rmax='+args[0][0])
			.success(function(data){
				rValues = parseDensityData(data);
				drawAreas(rValues);
			})
			.error(d3.json("resources/lib/sampleJSONs/krvalue_whole_plane_json_sample.json", function(error, data) {
				if (error) return console.warn(error);
				rValues = parseDensityData(data);
				// drawAreas(rValues);
				// console.log(data);
				// console.log('rValues:');
				// console.log(rValues);
			}));			

		}
		else{
			$http.get('http://localhost:8080/getKSortedList')
        	.success(function(data){
				rValues = parseDensityData(data);
				drawAreas(rValues);
        	})
        	.error(
	        d3.json("resources/lib/sampleJSONs/krvalue_whole_plane_json_sample.json", function(error, data) {
				if (error) return console.warn(error);
				rValues = parseDensityData(data);
				drawAreas(rValues);
				// console.log(data);
				// console.log('rValues:');
				// console.log(rValues);					
			}));
			}
	}

	function parseDensityData(data){
		var rValues = {};
		// console.log('JSON kSortedList');
		// console.log(data);
		for(var key in data){
			var kValue = key.slice(1)-1;
			var rValuesTemp=[];
			var kSortedList=data[key];
			var step = amountPerArea[kvalue];
			var currentIndex = step;
			var previousR = 0;
			// console.log(kSortedList);

			while(currentIndex<kSortedList.length){
				r=kSortedList[currentIndex].r;
				if(r>maxGraphR)break;
				rValuesTemp.push({r:r,size:r-previousR,points:step});
				currentIndex += step;
				previousR=r;
			}

			if (currentIndex !==kSortedList.length) {rValuesTemp.push({r:maxGraphR,size:maxGraphR-previousR,points:kSortedList.length%step});}
			// console.log(rValuesTemp);
			rValues[key] = rValuesTemp;
		}
		return rValues;
	}

	function drawAreas(rValues){
		console.log('drawing Boundary areas');
		svg = d3.select('.boundaryBackground');

		for (var key in rValues){
			kSortedList = rValues[key];
			k = key.slice(1)-1;
			// console.log(k);

		// rValues.forEach(function(kSortedList,k){
			// console.log(kSortedList);
			kSortedList.reverse().forEach(drawSingleArea);

		}
		// for(var y=9; y>=0; y--){
		// 	for (var x =0 ; x <10; x++){
		// 		// console.log('X:'+x+' Y:'+y);
				// svg.append('rect')
				// 	.attr('x', scales.x(x))
				// 	.attr('y', scales.y(densityCorners[y]))
				// 	.attr('width',scales.x(1))
				// 	.attr('height',scales.y(100-densityCorners[y]))
				// 	.attr('fill', function(){
				// 		return colorScale(densityMatrix[x][y]);
				// 	})
				// 	.attr('stroke-width', '1')
				// 	.classed('density' +densityMatrix[x][y],true)
				// 	.attr('stroke','black');
		// 	}
		// }
	}


	function drawSingleArea(bound){
		// console.log(bound);
		r=bound.r;
		if(r!==0){
			svg.append('rect')
				.attr('x', scales.x(k))
				.attr('y', scales.y(r))
				.attr('width',scales.x(1))
				.attr('height',scales.y(maxGraphR-r))
				.attr('fill', function(){
					var density = bound.points/(bound.size+1);
					// console.log('k:'+ k+' r:'+r+' density:'+density+' size:'+bound.size);
					return colorScale(density);
				})
				.attr('stroke-width', '1')
				.attr('stroke','black')
				.attr('class','densityRectangle visible')
	            .style("pointer-events", "all");
	        }
	}

	// $rootScope.$on('updatedBoundaryScales', createDensityMatrix);

	return{
		setData:function(data){
			krArray=data;
			createDensityMatrix();
		},

		createDensityMatrix:createDensityMatrix
	};
}]);