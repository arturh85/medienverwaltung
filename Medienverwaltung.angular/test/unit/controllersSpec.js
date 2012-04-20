/* jasmine specs for controllers go here */

describe('MediaController', function(){
  var myCtrl1;

  beforeEach(function(){
      $scope = {};
    myCtrl1 = new MediaController($scope);
  });


  it('should fill the scope with an empty list', function() {
    expect($scope.messages).toBeDefined();
  });
});


describe('ChatController', function(){
  var myCtrl2;


  beforeEach(function(){
	$scope = {}
    myCtrl2 = new ChatController($scope);
    
  });


  it('should ....', function() {
    //spec body
  });
});
