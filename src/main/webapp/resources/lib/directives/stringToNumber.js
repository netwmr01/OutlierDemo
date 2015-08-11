angular.module('indexApp').directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        restrict:'C',
        link: link
    };
    // creates parser and formatters so that the number fields 
    // interacts properly with angular scope variables
    function link(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
            return '' + value;
        });
        ngModel.$formatters.push(function(value) {
            return parseFloat(value, 10);
        });
    }
});