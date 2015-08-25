angular.module('indexApp').factory('legendSet',
		['$http','$rootScope', function($http,$rootScope){
			
		var legendNum = 0;
			
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
		var invisible = [[],[]];
		
		return {
			updateLegend:function(legendNumber){
				legendNum = legendNumber;
				$rootScope.$broadcast('updateLegend',legendNum);
				$rootScope.$broadcast('updateVisible',legendNum);
				console.log('Updating legend to legend '+legendNumber);
			},
			getCurrentLegend:function(){
				return legends[legendNum];
			},
			getCurrentLegendNum: function(){
				return legendNum;
			},
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
			getVisible:function(){
				return invisible[legendNum];
			}
		
		};
}]);