function AuthController($rootScope, $scope, $http, $location) {
    console.log("authcontroller!");

    $rootScope.auth = undefined;

    $http({method: 'GET', url: '/user/me'}).
        success(function(data, status, headers, config) {
            $rootScope.auth = data;
            console.log("successfully authenticated");
            console.log("path: " + $location.path());
        }).
        error(function(data, status, headers, config) {
            $rootScope.auth === false;
            console.log("failed with status " + status + ": " + data);
        });
}
AuthController.$inject = ["$rootScope", "$scope", "$http", "$location"];
