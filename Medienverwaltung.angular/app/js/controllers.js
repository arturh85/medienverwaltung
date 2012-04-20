'use strict';
/* App Controllers */

var baseUrl = "http://localhost:8080/medienverwaltung"

function MediaController($scope, MediaCollection) {
    $scope.loading = false;

    $scope.reload = function() {
        $scope.loading = true;
        MediaCollection.query(function(medium) {
            $scope.media = medium;
            $scope.loading = false;
            console.log("loaded media: " + medium.toString());
        });
    }
    $scope.addByISBN = function() {
        console.log("adding " + $scope.isbn);
        MediaCollection.save({isbn: $scope.isbn}, function(medium) {
            console.log("added: " + medium.toString());
            $scope.reload();
        });
    }
    $scope.delete = function(medium) {
        console.log("deleting " + medium.toString());
        medium.destroy(function(medium) {
            console.log("deleted: " + medium.toString());
            $scope.reload();
        });
    }

    $scope.reload();
}
MediaController.$inject = ["$scope", "MediaCollection"];

function LoginController($scope) {
}
LoginController.$inject = ["$scope"];

function DummyController($scope) {
}
DummyController.$inject = ["$scope"];
