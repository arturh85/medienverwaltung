/* jasmine specs for controllers go here */

describe('MediaController', function(){
  var mediaController;

  beforeEach(function(){
      $scope = {};
      var mediaCollection = {
          query: function() {

          }
      };

      var $route = {
          current: {
              params: []
          }
      };
      mediaController = new MediaController($scope, $route, mediaCollection);
  });


  it('should fill the scope with methods', function() {
    expect($scope.addByISBN).toBeDefined();
    expect($scope.delete).toBeDefined();
    expect($scope.reload).toBeDefined();
    expect($scope.loading).toBeDefined();
    expect($scope.params).toBeDefined();
  });
});

