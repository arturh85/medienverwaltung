'use strict';

controllersModule.controller('AuthController', ["$rootScope", "$http", "$location", function($rootScope, $http, $location) {
	console.log("init AuthController");
	$rootScope.auth = undefined;

	$http({method: 'GET', url: '/user/me'}).
		success(function(data, status, headers, config) {
			$rootScope.auth = data;
			console.log("successfully authenticated");
			console.log("path: " + $location.path());
		}).
		error(function(data, status, headers, config) {
			$rootScope.auth = false;
			console.log("authentication failed with status " + status + ": " + data);
		});
}]);

