angular.module('indexApp').controller('uploadCtrl',
    ['$scope', '$http', '$window', '$modal','$rootScope', function($scope,$http,$window,$modal,$rootScope){
    
    $scope.files=['1','2','3'];
    
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
	
	
	$http.get('http://localhost:8080/getComputedFileList')
		.success(function(data){
			$scope.files=data;
		    console.log($scope.files);
		});

}]);