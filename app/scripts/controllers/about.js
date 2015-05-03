'use strict';

/**
 * @ngdoc function
 * @name lctUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the lctUiApp
 */
angular.module('lctUiApp')
  .controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
