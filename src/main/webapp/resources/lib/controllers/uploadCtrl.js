// Angular controller for the upload dialog and the File list
angular.module('indexApp').controller('uploadCtrl',
    ['$scope', '$http', '$modal','$rootScope', function($scope,$http,$modal,$rootScope){
    
    $scope.files=[];
    
	$scope.open = function () {
	    var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'resources/lib/templates/uploadDialog.html'
	  	});
  	}
	
	$scope.click = function(fileName){
		console.log("switching datafiles to "+fileName);
		$rootScope.$broadcast('changeFile',{file:fileName});
	}
	
	
	$http.get('getComputedFileList')
		.success(function(data){
			$scope.files=data;
		    console.log($scope.files);
		});

}]);