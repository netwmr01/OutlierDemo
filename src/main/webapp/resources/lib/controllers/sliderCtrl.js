angular.module('indexApp').controller('sliderCtrl',
    ['$scope', '$http', 'updateKR', function($scope,$http, updateKR){

    $scope.kvalue=5;
    $scope.rvalue=5000;

    // when the kr value is changed by the slider or text box update the kr
    $scope.updateKRValue = function(){
         updateKR.setKR($scope.kvalue, $scope.rvalue);
    };

    //resets the KRValue when updateKR is heard
    $scope.$on('updateKR', function(event, args){
		// console.log('adjusting sliders');
        $scope.kvalue = args.k;
        $scope.rvalue = args.r;
    });



}]);
