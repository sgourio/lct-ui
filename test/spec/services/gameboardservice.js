'use strict';

describe('Service: gameBoardService', function () {

  // load the service's module
  beforeEach(module('lctUiApp'));

  // instantiate service
  var gameBoardService;
  beforeEach(inject(function (_gameBoardService_) {
    gameBoardService = _gameBoardService_;
  }));

  it('should do something', function () {
    expect(!!gameBoardService).toBe(true);
  });

});
