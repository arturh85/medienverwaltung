'use strict';

controllersModule.controller('RegisterController', ["$scope", "$route", "User", "$location", function($scope, $route, User, $location) {
	console.log("init RegisterController");
    $scope.user = new User();

    var query = {};

    $scope.isClean = function() {
        return angular.equals($scope.original, $scope.user);
    };

    $scope.save = function() {
        $scope.user.save(function() {
            console.log("saved!");
            $location.path("/login");
        });
    };
}]);
