angular.module("umbraco")
    .controller("BBB.ButtonPicker", 
  function ($scope, assetsService, editorState) {
    $scope.current = editorState.current;

    if (!$scope.model.value)
      $scope.model.value = $scope.model.config.defaultValue;

        assetsService.load([
            "~/App_Plugins/buttonsbuttonsbuttons/editors/bbb.buttonpicker.js"
        ]).then(function() {
        });
        
        assetsService.loadCss("~/App_Plugins/buttonsbuttonsbuttons/editors/bbb.buttonpicker.css");
    });
