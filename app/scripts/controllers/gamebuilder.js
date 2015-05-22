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

    $scope.displayPopover = false;
    $scope.displayDeck = false;
    $scope.currentJoker = null;
    $scope.deck = [];
    $scope.suggestions = [];
    $scope.selectedSuggestIndex= -1;

    $scope.$on('$viewContentLoaded', function() {
      boardOffset = angular.element('.board').offset();
    });

    $scope.init = function() {
      gameBoardService.getInitialFrenchDeck(function(data){
        $scope.deck = data;
        gameBoardService.sortTiles($scope.deck);
      });

      gameBoardService.getInitialScrabbleBoardGame(function(data){
        $scope.board = data;
        for( var i = 0 ; i < 15 ; i++){
          for( var j = 0 ; j < 15 ; j++){
            var position = gameBoardService.squarePosition(i, j, squareHeight, squareWitdh, squareOffSetY, squareOffSetX);
            $scope.board.squares[i][j].style = {top: position.top, left: position.left};
          }
        }
        $scope.board.middleSquare = $scope.board.squares[7][7];
      });
      $scope.draw = [];
    };

    $scope.chooseLetter = function(index){
      gameBoardService.drawTile($scope.board, $scope.draw, $scope.deck, index);
      var tiles = gameBoardService.getTilesFrom($scope.board, $scope.draw);
      gameBoardService.findWords(tiles, $scope.board, $scope.suggestions);
      $scope.selectedSuggestIndex = -1;
    };

    $scope.unchooseLetter = function(index){
      gameBoardService.undrawTile($scope.draw, $scope.deck, index);
      var tiles = gameBoardService.getTilesFrom($scope.board, $scope.draw);
      gameBoardService.findWords(tiles, $scope.board, $scope.suggestions);
      $scope.selectedSuggestIndex = -1;
    };

    $scope.clearDraw = function(){
      gameBoardService.clearDraw($scope.draw, $scope.deck);
    };

    $scope.randomDraw = function(){
      gameBoardService.randomDraw($scope.board, $scope.draw, $scope.deck);
      gameBoardService.findWords($scope.draw, $scope.board, $scope.suggestions);
      $scope.selectedSuggestIndex = -1;
    };

    $scope.startChangeJokerValue = function(tile){
      $scope.currentJoker = tile;
    };

    $scope.changeJokerValue = function(letter){
      $scope.currentJoker.imageURL = 'images/lettres36/fr/joker/'+letter+'.gif';
      $scope.currentJoker.value = letter;
    };

    $scope.findWords = function(){
      //gameBoardService.clearBoard($scope.board, $scope.draw);
      var tiles = gameBoardService.getTilesFrom($scope.board, $scope.draw);
      gameBoardService.findWords(tiles, $scope.board, $scope.suggestions);
      $scope.selectedSuggestIndex = -1;
    };

    $scope.putWord = function(suggest, $index){
      $scope.selectedSuggestIndex = $index;
      gameBoardService.putWord($scope.board, $scope.draw, suggest);
    };

    $scope.validTurn = function(){
      gameBoardService.validTurn($scope.board);
    };

  }]);

