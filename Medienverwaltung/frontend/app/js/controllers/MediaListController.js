function MediaListController($scope, $route, MediaCollection, $http) {
    $scope.params = $route.current.params;
    $scope.loading = false;
    $scope.amazonResults = [];

    $scope.reload = function() {
        $scope.loading = true;
        var query = {};
        if($scope.params.type) {
            if($scope.params.type === 'withoutImage') {
                query.image = undefined;
            } else {
                query.type = $scope.params.type;
                console.log("filtering by " + $scope.params.type);
            }
        }

        MediaCollection.query(query, function(medium) {
            $scope.media = medium;
            $scope.loading = false;
            console.log("loaded media: " + JSON.stringify(medium));
        });
    };

    $scope.addByISBN = function() {
        console.log("adding " + $scope.isbn);
        MediaCollection.save({isbn: $scope.isbn}, function(medium) {
            console.log("added: " + JSON.stringify(medium));
            $scope.isbn = '';
            $scope.reload();
        });
    };

    $scope.deleteMedium = function(medium) {
        console.log("deleting " + JSON.stringify(medium));

        medium.$delete({id: medium._id}, function() {
            console.log("success");
            $scope.reload();
        });
    };

    $scope.reload();
}
MediaListController.$inject = ["$scope", "$route", "MediaCollection", "$http", "$rootScope"];
