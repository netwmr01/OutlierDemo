angular.module('indexApp').controller('TabCtrl',['$scope', '$window', function($scope,$window){
    // sets up tabs that are under development
    $scope.tabs = [
        { title:'COA', content:'Under Developing' }
    ];
}]);