'use strict';

/**
 * @ngdoc function
 * @name lctUiApp.controller:GamebuilderCtrl
 * @description
 * # GamebuilderCtrl
 * Controller of the lctUiApp
 */
angular.module('lctUiApp')
  .controller('GamebuilderCtrl', ['$scope', '$http','gameBoardService', function ($scope, $http, gameBoardService) {

    var squareWitdh = 37;
    var squareHeight = 37;
    var squareOffSetX = 16;
    var squareOffSetY = 14;
    var boardOffset = 0;



    $scope.$on('$viewContentLoaded', function() {
      boardOffset = angular.element('.board').offset();
    });

    $scope.init = function() {
      $scope.displayPopover = false;
      $scope.displayDeck = false;
      $scope.currentJoker = null;
      $scope.deck = [];
      $scope.suggestions = [];
      $scope.selectedSuggestIndex= -1;
      $scope.game = {};
      $scope.game.turnList = [];
      $scope.draw = [];
      $scope.currentTurnNumber = 1;

      gameBoardService.getInitialScrabbleBoardGame(function(data){
        $scope.board = data;
        for( var i = 0 ; i < 15 ; i++){
          for( var j = 0 ; j < 15 ; j++){
            var position = gameBoardService.squarePosition(i, j, squareHeight, squareWitdh, squareOffSetY, squareOffSetX);
            $scope.board.squares[i][j].style = {top: position.top, left: position.left};
          }
        }
        $scope.board.middleSquare = $scope.board.squares[7][7];

        gameBoardService.getInitialFrenchDeck(function(data){
          $scope.deck = data;
          gameBoardService.sortTiles($scope.deck);
          $scope.randomDraw();
        });
      });

    };

    $scope.chooseLetter = function(index){
      gameBoardService.drawTile($scope.board, $scope.draw, $scope.deck, index);
      var tiles = gameBoardService.getTilesFrom($scope.board, $scope.draw);
      $scope.findWords();
    };

    $scope.unchooseLetter = function(index){
      gameBoardService.undrawTile($scope.draw, $scope.deck, index);
      var tiles = gameBoardService.getTilesFrom($scope.board, $scope.draw);
      $scope.findWords();
    };

    $scope.clearDraw = function(){
      gameBoardService.clearDraw($scope.draw, $scope.deck);
    };

    $scope.randomDraw = function(){
      gameBoardService.randomDraw($scope.board, $scope.draw, $scope.deck, $scope.currentTurnNumber);
      $scope.findWords();
    };

    $scope.startChangeJokerValue = function(tile){
      $scope.currentJoker = tile;
    };

    $scope.changeJokerValue = function(letter){
      $scope.currentJoker.imageURL = 'images/lettres36/fr/joker/'+letter+'.gif';
      $scope.currentJoker.value = letter;
    };

    $scope.findWords = function(){
      $scope.selectedSuggestIndex = -1;
      var tiles = gameBoardService.getTilesFrom($scope.board, $scope.draw);
      $scope.callingFindWords = true;
      gameBoardService.findWords(tiles, $scope.board, $scope.suggestions, function(){
        $scope.callingFindWords = false;
      });
    };

    $scope.putWord = function(suggest, $index){
      $scope.selectedSuggestIndex = $index;
      gameBoardService.putWord($scope.board, $scope.draw, suggest);
    };

    $scope.validTurn = function(){
      gameBoardService.validTurn($scope.board);
      $scope.currentTurnNumber++;
      $scope.randomDraw();
    };

  }]);

