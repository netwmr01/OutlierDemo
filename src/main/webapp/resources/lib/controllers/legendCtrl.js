angular.module('indexApp').controller('legendCtrl',
    ['$scope', '$http', function($scope,$http){
    	
	 $scope.status = {
	    isopen: false
	  };
	 
	 $scope.names= ["Outlierness", "Groups"];
	 
	 $scope.currentlyVisible = 0;
	 
	 $scope.show = function(selection){
		 if(selection !== $scope.currentlyVisible){
			 switch($scope.currentlyVisible){
			 case 0:
				 break;
			 case 1:
				 break;
			 }
			 switch(selection){
			 case 0:
				 break;
			 case 1:
				 break;
			 }
			 $scope.currentlyVisible=selection;
			 console.log("Showing "+$scope.names[selection]);
			 
		 }else{
			 console.log("Already showing "+ $scope.names[selection])
		 }
	 };
    }]);