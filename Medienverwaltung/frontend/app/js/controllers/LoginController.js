function LoginController($scope, $http, $location) {
    $scope.email = "";
    $scope.password = "";
    $scope.usePasswortLogin = false;

    $scope.signinMyOpenid = function() {
        console.log("signinMyOpenid");
        document.location = "/auth/openid?openid_identifier=http://myopenid.com/#";
    };

    $scope.signinGoogle = function() {
        console.log("signinGoogle");
        document.location = "/auth/openid?openid_identifier=https://www.google.com/accounts/o8/id#";
    };

    $scope.signinFacebook = function() {
        console.log("signinFacebook");
        //$location.url("/auth/facebook#");
        document.location = "/auth/facebook";
    };

    $scope.signinPassword = function() {
        console.log("signinPassword");
        $scope.usePasswortLogin = !$scope.usePasswortLogin;
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
    }
}
LoginController.$inject = ["$scope", "$http", "$location"];
