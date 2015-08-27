angular.module('indexApp').factory('legendSet',
		['$http','$rootScope', function($http,$rootScope){
		
		//current legend index
		var legendNum = 0;
		
		//array of legend array
		var legends = [[
		                {class_name: 'outlier', actual_name: 'Outlier'},
		                {class_name: 'dataPoint', actual_name: 'Inlier'},
		                {class_name: 'constOut', actual_name: 'Constant Outlier'},
		                {class_name: 'constIn', actual_name: 'Constant Inlier'}
		            ],[
		                {class_name: 'group0', actual_name: 'Group 0'},
		                {class_name: 'group1', actual_name: 'Group 1'},
		                {class_name: 'group2', actual_name: 'Group 2'},
		                {class_name: 'group3', actual_name: 'Group 3'}
		            ]];
		
		// initializes the arrays of invisible classes
		var invisible = [[],[]];
		
		return {
			//switches the current legend
			updateLegend:function(legendNumber){
				legendNum = legendNumber;
				$rootScope.$broadcast('updateLegend',legendNum);
				$rootScope.$broadcast('updateVisible',legendNum);
				console.log('Updating legend to legend '+legendNumber);
			},
			//returns the current legend
			getCurrentLegend:function(){
				return legends[legendNum];
			},
			//returns the current legend index
			getCurrentLegendNum: function(){
				return legendNum;
			},
			//adds a class to the proper array or removes it if it already exists in the array
			setVisible:function(classname,legend){
				if(!legend) var legend = legendNum;
				var index = invisible[legend].indexOf(classname);
				if(index === -1){
					invisible[legend].push(classname);
				}else{
					invisible[legend].splice(index,1);
				}
				console.log(invisible);
			},
			//returns the array of invisible classes
			getVisible:function(){
				return invisible[legendNum];
			}
		
		};
}]);