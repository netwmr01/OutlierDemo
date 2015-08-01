angular.module('indexApp').directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        restrict:'C',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value, 10);
            });
        }
    };
});