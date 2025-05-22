angular.module("umbraco").controller("Igloo.Controller", function ($scope, $http, assetsService, notificationsService) {
  $scope.loading = true;

  $scope.GetLicense = function () {
    $http({
      url: "/Umbraco/backoffice/Igloo/IglooApi/GetLicenseKey",
      method: "GET"
    }).then(function successCallback(response) {
      $scope.IglooLicenseKey = response.data.Key;
      $scope.IglooLicenseKeyValid = response.data.Valid;
      $scope.IglooLicenseDate = response.data.Date;
      $scope.IglooLicenseDateInValid = response.data.DatePassed;
      $scope.IglooLicenseDomain = response.data.Domain;
      $scope.loading = false;
    }, function errorCallback(response) {
      $scope.error = response.statusText;
    });
  }

  $scope.GetLicense();

  $scope.RegisterLicense = function () {
    $scope.loading = true;

    $http({
      url: "/Umbraco/backoffice/Igloo/IglooApi/SetLicenseKey",
      method: "POST",
      data: { Key: this.IglooLicenseKeyModel }
    }).then(function successCallback(response) {
      $scope.loading = false;

      $scope.IglooLicenseKey = response.data.Key;
      $scope.IglooLicenseKeyValid = response.data.Valid;
      $scope.IglooLicenseDate = response.data.Date;
      $scope.IglooLicenseDateInValid = response.data.DatePassed;
      $scope.IglooLicenseDomain = response.data.Domain;
    }, function errorCallback(response) {
      $scope.loading = false;
      $scope.error = response.statusText;
    });
    };

    $scope.RegisterToken = function () {
        $scope.loading = true;
    $http({
        url: "/Umbraco/backoffice/Igloo/IglooApi/SetLicenseToken",
        method: "POST",
        data: { Token: this.IglooLicenseTokenModel }
    }).then(function successCallback(response) {
        $scope.loading = false;

        $scope.IglooLicenseKey = response.data.Key;
        $scope.IglooLicenseKeyValid = response.data.Valid;
        $scope.IglooLicenseDate = response.data.Date;
        $scope.IglooLicenseDateInValid = response.data.DatePassed;
        $scope.IglooLicenseDomain = response.data.Domain;
    }, function errorCallback(response) {
        $scope.loading = false;
        $scope.error = response.statusText;
    });
    };

    $scope.changeTab = changeTab;

    $scope.tabs = [
        {
            "alias": "tabOne",
            "label": "License Key",
            "active": true
        },
        {
            "alias": "tabTwo",
            "label": "License Token (Advanced)"
        }
    ];

    function changeTab(selectedTab) {
        $scope.tabs.forEach(function (tab) {
            tab.active = false;
        });
        selectedTab.active = true;
    };

});