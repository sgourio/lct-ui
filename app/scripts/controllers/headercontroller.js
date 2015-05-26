'use strict';

/**
 * @ngdoc function
 * @name lctUiApp.controller:HeadercontrollerCtrl
 * @description
 * # HeadercontrollerCtrl
 * Controller of the lctUiApp
 */
angular.module('lctUiApp')
  .controller('HeadercontrollerCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }]);
