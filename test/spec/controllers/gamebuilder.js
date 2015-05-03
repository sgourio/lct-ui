'use strict';

describe('Controller: GamebuilderCtrl', function () {

  // load the controller's module
  beforeEach(module('lctUiApp'));

  var GamebuilderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GamebuilderCtrl = $controller('GamebuilderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
