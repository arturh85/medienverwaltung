/* global LoginController: true, MediaEditController: true, MediaListController: true */

(function () {
    "use strict";
    // Declare app level module which depends on filters, and services
    angular.module('medienverwaltung', [
        'medienverwaltung.filters',
        'medienverwaltung.services',
        'medienverwaltung.directives',
        'medienverwaltung.collections'
    ]).
      config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {template: 'partials/login.html', controller: LoginController});
        $routeProvider.when('/media/edit/:id', {template: 'partials/media/form.html', controller: MediaEditController});
        $routeProvider.when('/media/:type', {template: 'partials/media/browse.html', controller: MediaListController});
        $routeProvider.when('/media', {template: 'partials/media/browse.html', controller: MediaListController});
        $routeProvider.otherwise({redirectTo: '/media'});
      }]);
}());
