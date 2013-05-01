'use strict';

controllersModule.controller('AmazonSearchBoxController', ["$scope", "$location", "$route", "$routeParams", function($scope, $location, $route, $routeParams) {
	console.log("init AmazonSearchBoxController");
	$scope.amazonSearchQuery = '';
	$scope.search = function() {
		$location.path("/amazon/search/" + $scope.amazonSearchQuery);
    };
}]);

