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

    $scope.displayPopover = false;

    $scope.$on('$viewContentLoaded', function() {
      boardOffset = angular.element('.board').offset();
    });

    $scope.init = function() {
      //$( ".draw" ).sortable({
      //  revert: true
      //});
      gameBoardService.getInitialFrenchDeck(function(data){
        $scope.deck = data;
        $scope.deckAlpha = [];
        var lastLetter = null;
        var line = -1;
        for( var i = 0; i < data.length ; i++){
          if( data[i].value != lastLetter && data[i].value != 'X' && data[i].value != 'Y' && data[i].value != 'Z' && data[i].value != '?'){
            line++;
            lastLetter = data[i].value;
            $scope.deckAlpha[line] = [];
            $scope.deckAlpha[line].push(data[i]);
            $scope.draw.push(data[i]);
          }else{
            $scope.deckAlpha[line].push(data[i]);
          }
        }
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

    $scope.dragStartFromDraw = function ($index, event){
      console.log("dragStartFromDraw");
      if (event.data != null) {
        $scope.dragFrom = 'draw';
        $scope.draw.splice($index, 1);
        console.log("index: " + $index);
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
      /*
      if (event.data != null) {
        $scope.dragFrom = 'draw';
        $scope.draw.splice($index, 1);
      }
      */
    };

    $scope.dragSuccessFromBoard = function(square, event){
      //console.log("drag success from board");
      //console.log(event.data);
      if (event.data != null) {
        $scope.dragFrom = 'board';
        $scope.dragSquare = square;
        square.tile = null;
        square.justDropped = false;
      }
    };

    $scope.onDropBoard = function (tile,event){

      if( tile != null ) {
        var posx = event.x - (boardOffset.left + squareOffSetX);
        var posy = event.y - (boardOffset.top + squareOffSetY);
        var position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
        console.log("drop " + tile.value + " on " + position.line + " " + position.column);
        var targetSquare = $scope.board.squares[position.line][position.column];
        if ( targetSquare.tile == null || (targetSquare.tile != null && targetSquare.justDropped)) {
          if (targetSquare.tile != null && targetSquare.justDropped) {
            //switch letters
            if ($scope.dragFrom == 'draw') {
              // drag from draw
              $scope.draw.push(targetSquare.tile);
            } else {
              //drag from board
              $scope.dragSquare.tile = targetSquare.tile;
              $scope.dragSquare.justDropped = true;
            }
          }
          targetSquare.tile = tile;
          targetSquare.justDropped = true;
        }
        $scope.dragFrom = null;
        $scope.dragSquare = null;
      }
    };

    $scope.onDropDraw = function (tile,event){
      $scope.draw.push(tile);
      $scope.dragFrom = null;
      $scope.dragSquare = null;
    }
  }]);

