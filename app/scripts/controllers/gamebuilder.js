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
            //$scope.draw.push(data[i]);
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

    $scope.clearDraw = function(){
      for( var i = 0; i < $scope.draw.length ; i++) {
          $scope.deck.push($scope.draw[i]);
      }
      $scope.draw = [];
    };

    $scope.randomDraw = function(){
      $scope.clearDraw();
      var limit = Math.min(7, $scope.deck.length);
      for( var i = 0; i < limit ; i++) {
        var index = Math.floor(Math.random() * $scope.deck.length);
        var tile = $scope.deck[index];
        $scope.deck.splice(index, 1);
        $scope.draw.push(tile);
      }
    };

  }]);

