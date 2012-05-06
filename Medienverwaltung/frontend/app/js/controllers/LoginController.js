function LoginController($scope, $http, $location) {
    $scope.email = "";
    $scope.password = "";

    $scope.login = function() {
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
    }
}
LoginController.$inject = ["$scope", "$http", "$location"];
