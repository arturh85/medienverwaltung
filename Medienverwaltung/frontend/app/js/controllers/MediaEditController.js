function MediaEditController($scope, $route, MediaCollection, $http, $location) {
    var self = this;
    $scope.params = $route.current.params;

    $scope.amazonData = {};

    $scope.fetchAmazonByISBN = function() {
        if($scope.media.isbn) {
            $http({method: 'GET', url: '/amazon/enrich/'+ $scope.media._id}).
                success(function(data, status, headers, config) {
                    self.original = data;
                    $scope.media = new MediaCollection(self.original);
                }).
                error(function(data, status, headers, config) {
                    console.log("failed");
                });
        }
    };

    $scope.reload = function() {
        MediaCollection.get({id: $scope.params.id}, function(media) {
            self.original = media;
            $scope.media = new MediaCollection(self.original);
        });
    };

    $scope.reload();

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.med);
    };

    $scope.isImageProperty = function(property) {
        return property.indexOf("Image") !== -1;
    };

    $scope.destroy = function() {
        self.original.destroy(function() {
            $location.path('/list');
        });
    };

    $scope.save = function() {
        $scope.media.update(function() {
            $location.path('/media');
        });
    };

}
MediaEditController.$inject = ["$scope", "$route", "MediaCollection", "$http", "$location"];
