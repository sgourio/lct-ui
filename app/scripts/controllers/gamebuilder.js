'use strict';

/**
 * @ngdoc function
 * @name lctUiApp.controller:GamebuilderCtrl
 * @description
 * # GamebuilderCtrl
 * Controller of the lctUiApp
 */
angular.module('lctUiApp')
  .controller('GamebuilderCtrl', ['$scope', '$http','gameBoardService', 'gameService', function ($scope, $http, gameBoardService, gameService) {

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
      $scope.game = {
        lang: 'fr',
        name: '',
        roundList: []
      };
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
      $scope.findWords();
    };

    $scope.unchooseLetter = function(index){
      gameBoardService.undrawTile($scope.draw, $scope.deck, index);
      $scope.findWords();
    };

    $scope.clearDraw = function(){
      gameBoardService.clearBoard($scope.board, $scope.draw);
      gameBoardService.clearDraw($scope.draw, $scope.deck);
      $scope.suggestions = [];
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
      $scope.callingFindWords = true;
      gameBoardService.findWords($scope.draw, $scope.board, $scope.suggestions, function(){
        $scope.callingFindWords = false;
      });
    };

    $scope.putWord = function($index){
      $scope.selectedSuggestIndex = $index;
      gameBoardService.putWord($scope.board, $scope.draw, $scope.suggestions[$index]);
    };

    $scope.validRound = function(){
      var droppedWord = $scope.suggestions[$scope.selectedSuggestIndex];
      var round = gameBoardService.validRound($scope.board, $scope.draw, droppedWord);
      $scope.game.roundList.push(round);
      $scope.currentTurnNumber++;
      $scope.randomDraw();
    };

    $scope.createGame = function(){
      if(typeof $scope.game.id === 'undefined' ) {
        gameService.add($scope.game);
      }else{
        gameService.save($scope.game);
      }
    };

  }]);

