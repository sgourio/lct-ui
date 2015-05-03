'use strict';

/**
 * @ngdoc function
 * @name lctUiApp.controller:GamebuilderCtrl
 * @description
 * # GamebuilderCtrl
 * Controller of the lctUiApp
 */
angular.module('lctUiApp')
  .controller('GamebuilderCtrl', ['$scope', '$http','gameBoardService', 'apiRoot', function ($scope, $http, gameBoardService, apiRoot) {

    var squareWitdh = 37;
    var squareHeight = 37;
    var squareOffSetX = 16;
    var squareOffSetY = 14;
    var boardOffset = 0;

    $scope.init = function() {
      boardOffset = angular.element('.board').offset();
      gameBoardService.getInitialFrenchDeck(function(data){
        $scope.deck = data;
      });
      gameBoardService.getInitialScrabbleBoardGame(function(data){
        $scope.board = data;
        for( var i = 0 ; i < 15 ; i++){
          for( var j = 0 ; j < 15 ; j++){
            var position = gameBoardService.squarePosition(i, j, squareHeight, squareWitdh, squareOffSetY, squareOffSetX);
            $scope.board.squares[i][j].style = {top: position.top, left: position.left};
          }
        }
      });
      $scope.draw = [];
    };

    $scope.chooseLetter = function(letter){
      console.log("chooseLetter");
      for(var i = $scope.deck.length - 1; i >= 0; i--) {
        if($scope.deck[i] === letter) {
          $scope.deck.splice(i, 1);
          $scope.draw.push(letter);
        }
      }
    };

    $scope.unchooseLetter = function($index, tile){
      console.log("unchooseLetter");
      if($scope.draw[$index] != null) {
        $scope.draw.splice($index,1);
        $scope.deck.push(tile);
      }
    };

    $scope.onDragStart = function (tile,event){
      tile.dragged = true;
    };
    $scope.onDragStop = function (tile, event){
      tile.dragged = false;
    };

    $scope.dragSuccessFromDraw = function($index, event){
      //console.log("drag success from draw " + $index);
      if (event.data != null) {
        var posx = event.x - (boardOffset.left + squareOffSetX);
        var posy = event.y - (boardOffset.top + squareOffSetY);
        var position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
        console.log("drop " + $scope.draw[$index].value + " on " + position.line + " " + position.column);
        if ($scope.board.squares[position.line][position.column].tile == null) {
          $scope.board.squares[position.line][position.column].tile = $scope.draw[$index];
          $scope.board.squares[position.line][position.column].justDropped = true;
          $scope.draw.splice($index, 1);
        }
      }
    };

    $scope.dragSuccessFromBoard = function(square, event){
      //console.log("drag success from board");
      //console.log(event.data);
      if (event.data != null) {
        var posx = event.x - (boardOffset.left + squareOffSetX);
        var posy = event.y - (boardOffset.top + squareOffSetY);
        var position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
        console.log("drop " + square.tile.value + " on " + position.line + " " + position.column);
        if ($scope.board.squares[position.line][position.column].tile == null) {
          $scope.board.squares[position.line][position.column].tile = square.tile;
          $scope.board.squares[position.line][position.column].justDropped = true;
          square.tile = null;
          square.justDropped = false;
        }else if ( $scope.board.squares[position.line][position.column].justDropped){
          //switch letters
          var oldTile = $scope.board.squares[position.line][position.column].tile;
          $scope.board.squares[position.line][position.column].tile = square.tile;
          square.tile = oldTile;
        }
      }
    };

    $scope.onDropBoard = function (tile,event){
      /*
      if( tile != null ) {
        //console.log("drop board");
        //console.log(tile);
        var posx = event.x - (boardOffset.left + squareOffSetX);
        var posy = event.y - (boardOffset.top + squareOffSetY);
        var position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
        $scope.board[position.line][position.column].tile = tile;
      }
      //letter.style = {top: position.top, left: position.left};
      */
    };
  }]);

