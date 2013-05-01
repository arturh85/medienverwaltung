'use strict';

controllersModule.controller('AmazonSearchResultController', ["$scope", "$location", "$route", "$routeParams", "$http", function($scope, $location, $route, $routeParams, $http) {
	console.log("init AmazonSearchResultController");
    var query = $routeParams.query;

	if(query) {
		$http({method: 'GET', url: '/amazon/search/'+ query}).
			success(function(data, status, headers, config) {
				$scope.amazonResults = data;
			}).
			error(function(data, status, headers, config) {
				console.log("query failed");
			});
    } else {
		console.log("got no query :(");
	}
}]);

