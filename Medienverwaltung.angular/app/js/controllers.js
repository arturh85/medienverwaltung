'use strict';
/* App Controllers */

var baseUrl = "/backend"

function MyCtrl1($scope, $http) {
    $http.get(baseUrl + "/media/books").
        success(function(data, status, headers, config) {
            console.log("success: " + data);
            $scope.books = data;
        }).
        error(function(data, status, headers, config) {
            console.log("failed: " + data);
            console.log("failed: " + status);
            console.log("failed: " + headers);
            console.log("failed: " + config);
        });

    /*
    $scope.books = [{
        "name": "Das Schwert der Wahrheit",
        "pages": 22,
        "imageurl": "http://ecx.images-amazon.com/images/I/5190756HFJL._BO2,204,203,200_PIsitb-sticker-arrow-click,TopRight,35,-76_AA300_SH20_OU03_.jpg"
    }];
    */

    $scope.add = function() {
        console.log("adding " + $scope.isbn);
        console.log($http.post.toString());

        $http.post(baseUrl + "/media/books", $scope.isbn).
            success(function(data, status, headers, config) {
                console.log("successfully added!");
            }).
            error(function(data, status, headers, config) {
                console.log("failed: " + data);
                console.log("failed: " + status);
                console.log("failed: " + headers);
                console.log("failed: " + config);
            });
    }
}
MyCtrl1.$inject = ["$scope", "$http"];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
