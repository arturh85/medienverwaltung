function ProfileController($scope, $route, UserCollection, $location) {
    $scope.params = $route.current.params;
    $scope.user = undefined;

    var query = {};
    var id = $scope.params.id;

    if(id === undefined) {
        console.log("tried to view your profile page without beeing logged in");
        $location.path("/login");
        return ;
    }

    UserCollection.get({id: id}, function(user) {
        $scope.original = angular.copy(user);
        $scope.user = user;
        $scope.loading = false;
        console.log("loaded user for profile: " + JSON.stringify(user));
    });

    $scope.isClean = function() {
        return angular.equals($scope.original, $scope.user);
    };

    $scope.update = function() {
        $scope.user.update(function() {
            $scope.original = angular.copy(user);
        });
    };
}
ProfileController.$inject = ["$scope", "$route", "UserCollection", "$location"];
