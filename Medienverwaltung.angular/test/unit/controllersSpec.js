/*global MediaListController: true */

(function () {
    "use strict";

    /* jasmine specs for controllers go here */

    describe('MediaListController', function(){
      var mediaController;
      var $scope = {};

      beforeEach(function(){
          var mediaCollection = {
              query: function() {

              }
          };

          var $route = {
              current: {
                  params: []
              }
          };
          mediaController = new MediaListController($scope, $route, mediaCollection);
      });


      it('should fill the scope with methods', function() {
        expect($scope.addByISBN).toBeDefined();
        expect($scope.deleteMedia).toBeDefined();
        expect($scope.reload).toBeDefined();
        expect($scope.loading).toBeDefined();
        expect($scope.params).toBeDefined();
      });
    });


}());
