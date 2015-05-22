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
          success(function (data) {
            for (var i = data.length - 1; i >= 0; i--) {
              if( data[i].tileType !== 'wildcard' ) {
                data[i].imageURL = 'images/lettres36/fr/normal/' + data[i].value+'.gif';
              }else{
                data[i].imageURL = 'images/lettres36/fr/normal/wildcard.gif';
              }
            }
            callback(data);
          }).
          error(function (data, status) {
            console.log('Service ' + apiRoot + '/board/fr/deck/init' +' respond ' + status);
          });
      },

      getInitialScrabbleBoardGame : function(callback){
        $http.get(apiRoot + '/board/fr/empty').
          success(function (data) {
            callback(data);
          }).
          error(function (data, status) {
            console.log('Service ' + apiRoot + '/board/fr/empty' +' respond ' + status);
          });
      },

      squarePosition : function (row, column, squareHeight, squareWitdh, squareOffSetY, squareOffSetX) {
        var position = {};
        position.top = (squareOffSetY + (squareHeight * row)) + 'px';
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
        var row = Math.floor(posy / squareHeight);
        if (row > 14) {
          row = 14;
        }
        if (column > 14) {
          column = 14;
        }
        var position = {};
        position.row = row;
        position.column = column;
        return position;
      },


      moveDrawToBoard : function(draw, board, tile, drawIndex, row, column){
        var targetSquare = board.squares[row][column];
        if (typeof targetSquare.droppedTile === 'undefined' || targetSquare.droppedTile === null){
          targetSquare.droppedTile = {
            tile :tile,
            value : tile.value
          };
          targetSquare.justDropped = true;
          draw.splice(drawIndex, 1);
          return true;
        }else if(targetSquare.justDropped){
          var switchedTile = targetSquare.droppedTile.tile;
          targetSquare.droppedTile.tile = tile;
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

      moveBoardToBoard : function(board, tile, row, column, originLine, originColumn){
        var targetSquare = board.squares[row][column];
        var originSquare = board.squares[originLine][originColumn];
        if (typeof targetSquare.droppedTile === 'undefined' || targetSquare.droppedTile === null){
          targetSquare.droppedTile = {
            tile :tile,
            value : tile.value
          };
          targetSquare.justDropped = true;
          originSquare.droppedTile = null;
          originSquare.justDropped = false;
          return true;
        }else if(targetSquare.justDropped){
          originSquare.droppedTile = targetSquare.droppedTile;
          targetSquare.droppedTile.tile = tile;
          return true;
        }
        return false;
      },

      moveBoardToDraw : function(board, draw, tile, drawDropIndex, originLine, originColumn){
        var originSquare = board.squares[originLine][originColumn];
        draw.splice(drawDropIndex, 0, tile);
        originSquare.droppedTile = null;
        originSquare.justDropped = false;
      },

      sortTiles : function(tab){
        if( tab.constructor === Array ) {
          tab.sort(function(a,b){
            return a.value.localeCompare(b.value);
          });
        }
      },

      clearDraw : function(draw, deck){
        Array.prototype.push.apply(deck, draw);
        this.sortTiles(deck);
        draw.splice(0,draw.length);// empty draw
      },

      clearBoard : function (board, draw){
        for( var i = 0 ; i < board.squares.length; i++){
          for( var j = 0; j < board.squares[i].length; j++){
            if( board.squares[i][j].justDropped ) {
              draw.push(board.squares[i][j].droppedTile.tile);
              board.squares[i][j].droppedTile = null;
              board.squares[i][j].justDropped = false;
            }
          }
        }
      },

      getTilesFrom : function (board, draw){
        var result = [];
        for( var i = 0 ; i < board.squares.length; i++){
          for( var j = 0; j < board.squares[i].length; j++){
            if( board.squares[i][j].justDropped ) {
              result.push(board.squares[i][j].droppedTile);
            }
          }
        }
        Array.prototype.push.apply(result, draw);
        return result;
      },


      randomDraw : function(board, draw, deck){
        this.clearBoard(board, draw);
        this.clearDraw(draw, deck);
        var limit = Math.min(7, deck.length);
        for( var i = 0; i < limit ; i++) {
          var index = Math.floor(Math.random() * deck.length);
          this.drawTile(board, draw, deck, index);
        }
      },

      drawTile : function(board, draw, deck, index){
        var left = 7;

        for( var i = 0 ; i < board.squares.length; i++) {
          for (var j = 0; j < board.squares[i].length; j++) {
            if (board.squares[i][j].justDropped) {
              left--;
            }
          }
        }

        if( draw.length < left) {
          draw.push(deck[index]);
          deck.splice(index, 1);
        }
      },

      undrawTile : function(draw, deck, index){
        var tile = draw[index];
        if( tile.tileType === 'wildcard'){
          tile.value='?';
          tile.imageURL = 'images/lettres36/fr/normal/wildcard.gif';
        }
        deck.push(draw[index]);
        draw.splice(index, 1);
        this.sortTiles(deck);
      },

      findWords : function(draw, board, possibleWords){
        var boardGameQueryBean = {
          tileList: draw,
          boardGame: board
        };

        $http.post(apiRoot + '/board/fr/bestword', boardGameQueryBean).
          success(function (data) {
            if( possibleWords.length > 0 ) {
              possibleWords.splice(0, possibleWords.length);
            }
            Array.prototype.push.apply(possibleWords, data);
            //console.log(data);
          }).
          error(function (data, status) {
            console.log('Service ' + apiRoot + '/board/fr/deck/init' +' respond ' + status);
          });
      },

      putWord : function(board, draw, suggest){
        this.clearBoard(board, draw);

        var i = suggest.row;
        var j = suggest.column;

        for (var k = 0; k < suggest.squareList.length; k++) {
          if( !board.squares[i][j].justDropped) {
            var droppedTile = suggest.squareList[k].droppedTile;
            if(droppedTile.tile.tileType !== 'wildcard') {
              for (var l = 0; l < draw.length; l++) {
                if (draw[l].value === droppedTile.tile.value) {
                  this.moveDrawToBoard(draw, board, draw[l], l, i, j);
                  break;
                }
              }
            }else{
              for (var m = 0; m < draw.length; m++) {
                if (draw[m].tileType === 'wildcard') {
                  draw[m].value = droppedTile.value;
                  draw[m].imageURL = 'images/lettres36/fr/joker/'+droppedTile.value+'.gif';
                  this.moveDrawToBoard(draw, board, draw[m], m, i, j);
                  break;
                }
              }
            }
          }
          if( suggest.horizontal){
            j++;
          }else{
            i++;
          }
        }
      },


      validTurn : function(board){
        for( var i = 0 ; i < board.squares.length; i++){
          for( var j = 0; j < board.squares[i].length; j++){
            board.squares[i][j].justDropped = false;
          }
        }
      }

    };
    return gameBoardService;
  }]);
