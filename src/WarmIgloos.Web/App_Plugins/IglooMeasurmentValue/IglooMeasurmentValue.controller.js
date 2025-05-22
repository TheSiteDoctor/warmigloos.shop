angular.module("umbraco").controller("IglooMeasurmentValue.Controller", function ($scope) {
    $scope.measurementValue = parseFloat($scope.model.value.toString().replace(/,/g, '.').replace($scope.model.config.measurment, ""));
    $scope.updateValue = function () {
        if ($scope.model.config.measurment) {
            $scope.model.value = parseFloat($scope.measurementValue.toString().replace(/,/g, '.')) + $scope.model.config.measurment;
        } else {
            $scope.model.value = parseFloat($scope.measurementValue.toString().replace(/,/g, '.'));
        }
    }
});