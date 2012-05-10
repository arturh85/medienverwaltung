var authControllerLoaded = false;

function AuthController($rootScope, $http, $location) {
    if(authControllerLoaded) {
        return ;
    }
    authControllerLoaded = true;

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
}
AuthController.$inject = ["$rootScope", "$http", "$location"];
