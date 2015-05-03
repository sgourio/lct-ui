'use strict';

/**
 * @ngdoc function
 * @name lctUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the lctUiApp
 */
angular.module('lctUiApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
