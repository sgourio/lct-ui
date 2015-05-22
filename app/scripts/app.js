'use strict';

/**
 * @ngdoc overview
 * @name lctUiApp
 * @description
 * # lctUiApp
 *
 * Main module of the application.
 */
angular
  .module('lctUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'nsPopover'
  ])
  .config(['$routeProvider', '$provide', function ($routeProvider, $provide) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/gameBuilder', {
        templateUrl: 'views/gamebuilder.html',
        controller: 'GamebuilderCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $provide.value('apiRoot', angular.element('#apiRoot').attr('href'));


  }]);
