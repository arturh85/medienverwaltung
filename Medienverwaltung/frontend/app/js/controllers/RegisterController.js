function RegisterController($scope, $route, UserCollection, $location) {
    $scope.user = new UserCollection();

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
}
RegisterController.$inject = ["$scope", "$route", "UserCollection", "$location"];
