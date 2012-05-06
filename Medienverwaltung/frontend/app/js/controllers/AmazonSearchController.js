function AmazonSearchController($scope, $location, $route) {
    if($route.current != undefined) {
        $scope.params = $route.current.params;
    } else {
        $scope.params = {};
    }

    if($scope.params.query) {
        $scope.searchAmazon = function() {
            $http({method: 'GET', url: '/amazon/search/'+ $scope.query}).
                success(function(data, status, headers, config) {
                    $scope.amazonResults = data;
                }).
                error(function(data, status, headers, config) {
                    console.log("failed");
                });
        };
    }

    $scope.search = function() {
        $location.path = "/amazon/search/" + $scope.amazonSearch;
    }
}
AmazonSearchController.$inject = ["$scope", "$location", "$route"];

