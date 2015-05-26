'use strict';

/**
 * @ngdoc service
 * @name lctUiApp.gameService
 * @description
 * # gameService
 * Service in the lctUiApp.
 */
angular.module('lctUiApp')
  .service('gameService', [ '$http', 'apiRoot', function ($http, apiRoot) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var gameService = {
      add: function(game){
        $http.post(apiRoot + '/game/fr/add', game).
          success(function (data) {
            console.log('Adding game end with success, id: ' + data);
            game.id = data;
          }).
          error(function (data, status) {
            console.log('Service ' + apiRoot + '/game/fr/add' +' respond ' + status);
          });
      },

      save: function(game){
        var req={
          method: 'PUT',
          url: apiRoot + '/game/fr/' + game.id,
          data: game
        };
        $http(req).
          success(function () {
            console.log('Game saved');
          }).
          error(function (data, status) {
            console.log('Service ' + apiRoot + '/game/fr/' + game.id +' respond ' + status);
          });
      }
    };
    return gameService;
  }]);
