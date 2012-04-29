(function () {
    "use strict";

    function MediaListController($scope, $route, MediaCollection, $http) {
        $scope.params = $route.current.params;

        $scope.loading = false;
        $scope.amazonResults = [];

        $scope.searchAmazon = function() {
            $http({method: 'GET', url: '/amazon/search/'+ $scope.query}).
                success(function(data, status, headers, config) {
                    $scope.amazonResults = data;
                }).
                error(function(data, status, headers, config) {
                    console.log("failed");
                });
        };

        $scope.reload = function() {
            $scope.loading = true;
            var query = {};
            if($scope.params.type) {
                if($scope.params.type == 'withoutImage') {
                    // TODO
                } else {
                    query.type = $scope.params.type;
                    console.log("filtering by " + $scope.params.type);
                }
            }

            MediaCollection.query(query, function(medium) {
                $scope.media = medium;
                $scope.loading = false;
                console.log("loaded media: " + medium.toString());
            });
        };

        $scope.addByISBN = function() {
            console.log("adding " + $scope.isbn);
            MediaCollection.save({isbn: $scope.isbn}, function(medium) {
                console.log("added: " + medium.toString());
                $scope.isbn = '';
                $scope.reload();
            });
        };

        $scope.delete = function(medium) {
            console.log("deleting " + medium.toString());

            medium.$delete({id:medium._id}, function() {
                console.log("success");
                $scope.reload();
            });
        };

        $scope.reload();
    }
    MediaListController.$inject = ["$scope", "$route", "MediaCollection", "$http"];

    function MediaEditController($scope, $route, MediaCollection, $http) {
        var self = this;
        $scope.params = $route.current.params;

        $scope.amazonData = {};

        MediaCollection.get({id: $scope.params.id}, function(media) {
            self.original = media;
            $scope.media = new MediaCollection(self.original);

            if($scope.media.isbn) {
                $http({method: 'GET', url: '/amazon/isbn/'+ $scope.media.isbn}).
                    success(function(data, status, headers, config) {
                        $scope.amazonData = data;
                    }).
                    error(function(data, status, headers, config) {
                        console.log("failed");
                    });
            }
        });

        $scope.isClean = function() {
            return angular.equals(self.original, $scope.project);
        }

        $scope.isImageProperty = function(property) {
            return property.indexOf("Image") != -1
        }

        $scope.destroy = function() {
            self.original.destroy(function() {
                $location.path('/list');
            });
        };

        $scope.save = function() {
            $scope.project.update(function() {
                $location.path('/list');
            });
        };
    }
    MediaEditController.$inject = ["$scope", "$route", "MediaCollection", "$http"];

    function LoginController($scope) {
    }
    LoginController.$inject = ["$scope"];

    function DummyController($scope) {
    }
    DummyController.$inject = ["$scope"];

}());
