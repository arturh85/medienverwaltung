(function () {
    "use strict";

    angular.module('medienverwaltung.collections', ['ngResource']).
        factory('MediaCollection', function($resource) {
            return $resource('api/media/:id', {}, {
                update: {method:'PUT'}
            });
        });
}());
