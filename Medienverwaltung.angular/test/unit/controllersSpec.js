/* jasmine specs for controllers go here */

describe('MyCtrl1', function(){
  var myCtrl1;

  beforeEach(function(){
      $scope = {};
    myCtrl1 = new MyCtrl1($scope);
  });


  it('should fill the scope with an empty list', function() {
    expect($scope.messages).toBeDefined();
  });
});


describe('MyCtrl2', function(){
  var myCtrl2;


  beforeEach(function(){
	$scope = {}
    myCtrl2 = new MyCtrl2($scope);
    
  });


  it('should ....', function() {
    //spec body
  });
});
