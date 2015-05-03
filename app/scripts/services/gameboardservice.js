'use strict';

/**
 * @ngdoc service
 * @name lctUiApp.gameBoardService
 * @description
 * # gameBoardService
 * Service in the lctUiApp.
 */
angular.module('lctUiApp')
  .service('gameBoardService', [ '$http', 'apiRoot', function ($http, apiRoot) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var gameBoardService = {

      getInitialFrenchDeck : function(callback){
        $http.get(apiRoot + '/board/fr/deck/init').
          success(function (data, status, headers, config) {
            for (var i = data.length - 1; i >= 0; i--) {
              if( data[i].tileType != 'wildcard' ) {
                data[i].imageURL = 'images/lettres36/fr/normal/' + data[i].value+'.gif';
              }else{
                data[i].imageURL = 'images/lettres36/fr/normal/wildcard.gif';
              }
            }
            callback(data);
          }).
          error(function (data, status, headers, config) {
            console.log("Service " + apiRoot + '/board/fr/deck/init' +" respond " + status);
          });
      },

      getInitialScrabbleBoardGame : function(callback){
        $http.get(apiRoot + '/board/fr/empty').
          success(function (data) {
            callback(data);
          }).
          error(function (data, status, headers, config) {
            console.log("Service " + apiRoot + '/board/fr/empty' +" respond " + status);
          });
      },

      squarePosition : function (line, column, squareHeight, squareWitdh, squareOffSetY, squareOffSetX) {
        var position = {};
        position.top = (squareOffSetY + (squareHeight * line)) + 'px';
        position.left = ( squareOffSetX + (squareWitdh * column)) + 'px';
        return position;
      },

      findLineColumn : function (posy, posx, squareHeight, squareWitdh) {
        //alert('test ' + angular.element('#apiRoot').attr('href'));
        if (posx < 0) {
          posx = 0;
        }
        if (posy < 0) {
          posy = 0;
        }
        var column = Math.floor(posx / squareWitdh);
        var line = Math.floor(posy / squareHeight);
        if (line > 14) {
          line = 14;
        }
        if (column > 14) {
          column = 14;
        }
        var position = {};
        position.line = line;
        position.column = column;
        return position;
      }
    };
    return gameBoardService;
  }]);
