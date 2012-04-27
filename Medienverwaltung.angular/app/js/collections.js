// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('medienverwaltung.collections', ['ngResource']).
    factory('MediaCollection', function($resource) {
        return $resource('api/media/:id', {}, {
            update: {method:'PUT'}
        });
    });
