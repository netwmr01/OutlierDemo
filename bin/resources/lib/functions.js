(function(){
    var app;
    app=angular.module('hello', []);

    var gem = { id: 'Error', content: 0 };

    app.controller('Hello',
        function($scope, $http){
            $http.get('http://localhost:8080/greeting').
                success(function(data) {
                    $scope.greeting = data;
                }).
                error(function(data) {
                    $scope.greeting =gem;
                });
        });

})();