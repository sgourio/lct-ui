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
      },


      moveDrawToBoard : function(draw, board, tile, drawIndex, line, column){
        var targetSquare = board.squares[line][column];
        if (targetSquare.tile == null){
          targetSquare.tile = tile;
          targetSquare.justDropped = true;
          draw.splice(drawIndex, 1);
          return true;
        }else if(targetSquare.justDropped){
          var switchedTile = targetSquare.tile;
          targetSquare.tile = tile;
          draw.splice(drawIndex, 1, switchedTile);
          return true;
        }
        // cancel
        return false;
      },

      moveDrawToDraw : function(draw, tile, drawIndex, drawDropIndex){
        if( drawDropIndex >= draw.length){
          draw[draw.length] = tile;
          draw.splice(drawIndex, 1);
        }else{
          draw.splice(drawIndex, 1);
          draw.splice(drawDropIndex, 0, tile);
        }
      },

      moveBoardToBoard : function(board, tile, line, column, originLine, originColumn){
        var targetSquare = board.squares[line][column];
        var originSquare = board.squares[originLine][originColumn];
        if (targetSquare.tile == null){
          targetSquare.tile = tile;
          targetSquare.justDropped = true;
          originSquare.tile = null;
          originSquare.justDropped = false;
          return true;
        }else if(targetSquare.justDropped){
          originSquare.tile = targetSquare.tile;
          targetSquare.tile = tile;
          return true;
        }
        return false;
      },

      moveBoardToDraw : function(board, draw, tile, drawDropIndex, originLine, originColumn){
        var originSquare = board.squares[originLine][originColumn];
        draw.splice(drawDropIndex, 0, tile);
        originSquare.tile = null;
        originSquare.justDropped = false;
      }

    };
    return gameBoardService;
  }]);
