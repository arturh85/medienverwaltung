'use strict';

controllersModule.controller('LoginController', ["$scope", "$http", "$location", function($scope, $http, $location) {
	console.log("init LoginController");
    $scope.email = "";
    $scope.password = "";
    $scope.usePasswortLogin = false;

    $scope.signinMyOpenid = function() {
        document.location = "/auth/openid?openid_identifier=http://myopenid.com/#";
    };

    $scope.signinGoogle = function() {
        document.location = "/auth/openid?openid_identifier=https://www.google.com/accounts/o8/id#";
    };

    $scope.signinFacebook = function() {
        document.location = "/auth/facebook";
    };

    $scope.passwordLogin = function() {
        var data = {email: $scope.email, password: $scope.password};
        var config = {};

        $http.post('/login', data, config).
            success(function(data, status, headers, config) {
                if(data.success) {
                    console.log("login successful");
                    $location.path("/media");
                } else {
                    console.log("login failed: " + data.toString());
                }
            }).
            error(function(data, status, headers, config) {
                console.log("failed");
            });
    };
}]);
