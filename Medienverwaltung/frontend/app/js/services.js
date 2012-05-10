(function () {
    "use strict";

    angular.module('medienverwaltung.services', ['ngResource'])
        .factory('Media', function($resource){
            return $resource('api/media/:id', {}, {});
        })
        .factory('User', function($resource){
            return $resource('api/user/:id', {}, {});
        })
        .value('version', '0.1')
        ;
}());
