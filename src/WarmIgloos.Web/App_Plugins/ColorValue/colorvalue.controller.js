angular.module("umbraco").controller("ColorValue.Controller", function ($scope, $http, assetsService) {
    $scope.IsWhite = function (color) {
        if (color) {
            var color = color.toLowerCase();

            if (color == "#fff")
                return true;

            if (color == "#ffffff")
                return true;

            if (color == "#fefefe")
                return true;
        }
    }
});