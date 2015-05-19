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

    return function(scope, element, attr) {
      //element.addClass("ui-state-default");
      var $board = angular.element('.board');
      var $draw = angular.element('.draw');
      var drawOffset = $draw.offset();
      var drawWidth = $draw.outerWidth();
      var drawHeight = $draw.height();

      var move = function(event, obj){
        // Place element where the finger is
        obj.css('position','absolute');
        obj.css('z-index','100');
        obj.css('left', (event.pageX - 17) + 'px');
        obj.css('top' , (event.pageY - 17) + 'px');
      };

      var isOnBoard = function(event){
        var boardOffset = $board.offset();
        var boardWidth = $board.outerWidth();
        var boardHeight = $board.height();

        return event.pageX > boardOffset.left
              && event.pageX < (boardOffset.left + boardWidth)
              && event.pageY > boardOffset.top
              && event.pageY < (boardOffset.top + boardHeight);
      };

      var isOnDraw = function(event){
        return event.pageX > drawOffset.left
          && event.pageX < (drawOffset.left + drawWidth)
          && event.pageY > drawOffset.top
          && event.pageY < (drawOffset.top + drawHeight);
      };



      var drawmousemove = function(event, obj){
        event.preventDefault();
        angular.element('.draw li').removeClass('over');
        if (isOnDraw(event)){
          var posx = event.pageX - drawOffset.left;
          var drawIndex = angular.element(obj).attr('data-index');
          var index = Math.floor( posx / squareWitdh);
          if( index >= drawIndex )index++;
          var current = angular.element('.draw li').eq(index);
          current.addClass('over');
        }

        move(event, obj);
      };
      var endmousemove = function(event, obj){
        event.preventDefault();
        $document.off("mousemove");
        angular.element('.draw li.over').removeClass('over');
        var from = angular.element(obj).attr('data-from');
        if( from == 'draw') {
          if (isOnBoard(event)) {
            var boardOffset = $board.offset();
            var posx = event.pageX - (boardOffset.left + squareOffSetX);
            var posy = event.pageY - (boardOffset.top + squareOffSetY);
            var position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
            var tile = JSON.parse(angular.element(obj).attr('data-value'));
            var drawIndex = angular.element(obj).attr('data-index');
            gameBoardService.moveDrawToBoard(scope.draw, scope.board, tile, drawIndex, position.line, position.column);
          } else if (isOnDraw(event)) {
            var tile = JSON.parse(angular.element(obj).attr('data-value'));
            var drawIndex = angular.element(obj).attr('data-index');
            var posx = event.pageX - drawOffset.left;
            var droppedIndex = Math.floor(posx / squareWitdh);
            gameBoardService.moveDrawToDraw(scope.draw, tile, drawIndex, droppedIndex);
          }
        }else{
          if (isOnBoard(event)) {
            var tile = JSON.parse(angular.element(obj).attr('data-value'));
            var originLine = angular.element(obj).attr('data-line');
            var originColumn = angular.element(obj).attr('data-column');
            var boardOffset = $board.offset();
            var posx = event.pageX - (boardOffset.left + squareOffSetX);
            var posy = event.pageY - (boardOffset.top + squareOffSetY);
            var position = gameBoardService.findLineColumn(posy, posx, squareHeight, squareWitdh);
            gameBoardService.moveBoardToBoard(scope.board, tile, position.line, position.column, originLine, originColumn);
          }else{
            var tile = JSON.parse(angular.element(obj).attr('data-value'));
            var originLine = angular.element(obj).attr('data-line');
            var originColumn = angular.element(obj).attr('data-column');
            var posx = event.pageX - drawOffset.left;
            var droppedIndex = Math.floor(posx / squareWitdh);
            gameBoardService.moveBoardToDraw(scope.board, scope.draw, tile, droppedIndex, originLine, originColumn);
          }
        }
        angular.element(element).parent().css('display','block');
        obj.remove();
        scope.$apply();
      };

      element.on("mousedown", function(event) {
        event.preventDefault();
        var clone = element.clone();
        angular.element($document[0].body).append(clone);
        angular.element(element).parent().css('display','none');
        move(event, clone);
        $document.on("mousemove", function(event){
          drawmousemove(event, clone);
        });
        clone.on("mouseup", function(event){
          endmousemove(event, clone);
        });

        clone.on('touchmove', function(event) {
          var touch = event.targetTouches[0];
          move(touch, clone);

          event.preventDefault();
        }, false);
      });
    };
  }]);
