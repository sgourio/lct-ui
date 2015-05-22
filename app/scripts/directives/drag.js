'use strict';

/**
 * @ngdoc directive
 * @name lctUiApp.directive:drag
 * @description
 * # drag
 */
angular.module('lctUiApp')
  .directive('drag',['$document', 'gameBoardService', function ($document, gameBoardService) {
    var squareWitdh = 37;
    var squareHeight = 37;
    var squareOffSetX = 16;
    var squareOffSetY = 14;

    return function(scope, element) {
      //element.addClass("ui-state-default");
      var $board = angular.element('.board');
      var $draw = angular.element('.draw');
      var drawOffset = $draw.offset();
      var drawWidth = $draw.outerWidth();
      var drawHeight = $draw.height();
      var boardOffset = $board.offset();
      var boardWidth = $board.outerWidth();
      var boardHeight = $board.height();

      var initOffset = function(){
        drawOffset = $draw.offset();
        drawWidth = $draw.outerWidth();
        drawHeight = $draw.height();
        boardOffset = $board.offset();
        boardWidth = $board.outerWidth();
        boardHeight = $board.height();
      };

      var move = function(pageX, pageY, obj){
        // Place element where the finger is
        obj.css('position','absolute');
        obj.css('z-index','100');
        obj.css('left', (pageX - 17) + 'px');
        obj.css('top' , (pageY - 17) + 'px');
      };

      var isOnBoard = function(pageX, pageY){
        return pageX > boardOffset.left && pageX < (boardOffset.left + boardWidth) && pageY > boardOffset.top && pageY < (boardOffset.top + boardHeight);
      };

      var isOnDraw = function(pageX, pageY){
        return pageX > drawOffset.left && pageX < (drawOffset.left + drawWidth) && pageY > drawOffset.top && pageY < (drawOffset.top + drawHeight);
      };


      var drawmousemove = function(pageX, pageY, obj){

        angular.element('.draw li').removeClass('over');
        if (isOnDraw(pageX, pageY)){
          var posx = pageX - drawOffset.left;
          var drawIndex = angular.element(obj).attr('data-index');
          var index = Math.floor( posx / squareWitdh);
          if( index >= drawIndex ){index++;}
          var current = angular.element('.draw li').eq(index);
          current.addClass('over');
        }

        move(pageX, pageY, obj);
      };
      var endmousemove = function(pageX, pageY, obj){
        angular.element('.draw li.over').removeClass('over');
        var from = angular.element(obj).attr('data-from');
        var posx,posy, position,tile,drawIndex,droppedIndex,originRow,originColumn;
        if( from === 'draw') {
          if (isOnBoard(pageX, pageY)) {
            posx = pageX - (boardOffset.left + squareOffSetX);
            posy = pageY - (boardOffset.top + squareOffSetY);
            position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
            tile = JSON.parse(angular.element(obj).attr('data-value'));
            drawIndex = angular.element(obj).attr('data-index');
            gameBoardService.moveDrawToBoard(scope.draw, scope.board, tile, drawIndex, position.row, position.column);
          } else if (isOnDraw(pageX, pageY)) {
            tile = JSON.parse(angular.element(obj).attr('data-value'));
            drawIndex = angular.element(obj).attr('data-index');
            posx = pageX - drawOffset.left;
            droppedIndex = Math.floor(posx / squareWitdh);
            gameBoardService.moveDrawToDraw(scope.draw, tile, drawIndex, droppedIndex);
          }
        }else{
          if (isOnBoard(pageX, pageY)) {
            tile = JSON.parse(angular.element(obj).attr('data-value'));
            originRow = angular.element(obj).attr('data-row');
            originColumn = angular.element(obj).attr('data-column');
            posx = pageX - (boardOffset.left + squareOffSetX);
            posy = pageY - (boardOffset.top + squareOffSetY);
            position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
            gameBoardService.moveBoardToBoard(scope.board, tile, position.row, position.column, originRow, originColumn);
          }else if (isOnDraw(pageX, pageY)){
            tile = JSON.parse(angular.element(obj).attr('data-value'));
            originRow = angular.element(obj).attr('data-row');
            originColumn = angular.element(obj).attr('data-column');
            posx = pageX - drawOffset.left;
            droppedIndex = Math.floor(posx / squareWitdh);
            gameBoardService.moveBoardToDraw(scope.board, scope.draw, tile, droppedIndex, originRow, originColumn);
          }
        }
        angular.element(element).parent().css('display','block');
        obj.remove();
        scope.$apply();
      };

      var dragStart = function(obj, pageX, pageY){
        initOffset();
        var clone = obj.clone();
        angular.element($document[0].body).append(clone);
        angular.element(obj).parent().css('display','none');
        move(pageX, pageY, clone);
        $document.on('mousemove', function(event){
          event.preventDefault();
          drawmousemove(event.pageX, event.pageY, clone);
        });
        $document.on('mouseup', function(event){
          event.preventDefault();
          $document.off('mousemove mouseup');
          endmousemove(event.pageX, event.pageY, clone);
        });
        $document.on('touchend', function(event){
          event.preventDefault();
          $document.off('touchmove touchend');
          var e = event.originalEvent;
          var touch = e.changedTouches[0];
          endmousemove(touch.pageX, touch.pageY, clone);
        });
        $document.on('touchmove', function(event) {
          event.preventDefault();
          var e = event.originalEvent;
          var touch = e.targetTouches[0];
          drawmousemove(touch.pageX, touch.pageY, clone);
        });
      };

      element.on('mousedown', function(event) {
        event.preventDefault();
        dragStart(element, event.pageX, event.pageY);
      });

      element.on('touchstart', function(event) {
        event.preventDefault();
        var e = event.originalEvent;
        var touch = e.targetTouches[0];
        dragStart(element, touch.pageX, touch.pageY);
      });

      //element.on('touchstart', function(event) {
      //  dragStart(element, event);
      //});
    };
  }]);
