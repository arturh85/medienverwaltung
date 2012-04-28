'use strict';
/* App Controllers */

var baseUrl = "http://localhost:8080/medienverwaltung"

function MediaListController($scope, $route, MediaCollection) {
    $scope.params = $route.current.params;

    $scope.loading = false;

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
    }

    $scope.addByISBN = function() {
        console.log("adding " + $scope.isbn);
        MediaCollection.save({isbn: $scope.isbn}, function(medium) {
            console.log("added: " + medium.toString());
            $scope.isbn = '';
            $scope.reload();
        });
    }

    $scope.delete = function(medium) {
        console.log("deleting " + medium.toString());

        medium.$delete({id:medium._id}, function() {
            console.log("success");
            $scope.reload();
        });
    }

    $scope.reload();
}
MediaListController.$inject = ["$scope", "$route", "MediaCollection"];

function MediaEditController($scope, $route, MediaCollection) {
    $scope.params = $route.current.params;

    MediaCollection.get({id: $scope.params.id}, function(media) {
        this.original = media;
        $scope.media = new MediaCollection(self.original);
    });

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.project);
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
MediaEditController.$inject = ["$scope", "$route", "MediaCollection"];

function LoginController($scope) {
}
LoginController.$inject = ["$scope"];

function DummyController($scope) {
}
DummyController.$inject = ["$scope"];
