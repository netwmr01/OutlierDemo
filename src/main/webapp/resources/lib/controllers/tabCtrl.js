angular.module('indexApp').controller('TabCtrl',
    ['$scope', '$window', function($scope,$window){
    
    // sets up tabs that are under development
    $scope.panes = [
        { title:'OD', long_name:'Outlier Detection', short_name:'OD', content:'resources/lib/templates/OutlierDetection.html' },
        { title:'PSE', long_name:'Parameter Space Exploration', short_name:'PSE',content:'resources/lib/templates/ParameterSpaceExploration.html' },
        { title:'COA', long_name:'Comparative Outlier Analysis', short_name:'COA', content:'resources/lib/templates/ComparativeOutlierAnalysis.html' }
    ];

    // returns the tab pane that is active
    $scope.active = function() {
        var panes = $scope.panes;
        panes.forEach(function(pane){
            pane.title=pane.short_name;
        });
        var active_pane = panes.filter(function(pane){
            return pane.active;
        })[0];
        active_pane.title=active_pane.long_name;
    };

}]);