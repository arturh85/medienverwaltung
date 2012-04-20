'use strict';
//if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };

// Declare app level module which depends on filters, and services
angular.module('medienverwaltung', [
    'medienverwaltung.filters',
    'medienverwaltung.services',
    'medienverwaltung.directives',
    'medienverwaltung.collections'
]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {template: 'partials/login.html', controller: LoginController});
    $routeProvider.when('/media', {template: 'partials/media/browse.html', controller: MediaController});
    $routeProvider.otherwise({redirectTo: '/media'});
  }]);

var cl = new CanvasLoader('canvasloader-container');
cl.show(); // Hidden by default
