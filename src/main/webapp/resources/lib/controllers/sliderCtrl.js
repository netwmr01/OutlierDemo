// Angular controller for the OD Tab AKA sliders
angular.module('indexApp').controller('sliderCtrl',
    ['$scope', 'updateKR', function($scope, updateKR){

    //the k and r slider values
    $scope.kvalue=5;
    $scope.rvalue=5000;

    // when the kr value is changed by the slider or text box update the kr
    $scope.updateKRValue = function(){
         updateKR.setKR($scope.kvalue, $scope.rvalue);
    };

    // creates an event listener fot the updateKR event
    // whe nthe event is heard, reset the k and r sliders to the right locations
    $scope.$on('updateKR', function(event, args){
		// console.log('adjusting sliders');
        $scope.kvalue = args.k;
        $scope.rvalue = args.r;
    });
    
    $scope.updateKRValue();



}]);
