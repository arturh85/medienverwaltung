'use strict';

// Declare app level module which depends on filters, and services
angular.module('medienverwaltung', [
		'medienverwaltung.filters',
		'medienverwaltung.services',
		'medienverwaltung.directives',
		'medienverwaltung.controllers']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/login/error/:message', {templateUrl: 'partials/login.html', controller: 'LoginController'});
		$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
		$routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterController'});
		$routeProvider.when('/profile/:id', {templateUrl: 'partials/profile.html', controller: 'ProfileController'});
		$routeProvider.when('/profile', {templateUrl: 'partials/prfile.html', controller: 'ProfileController'});
		$routeProvider.when('/amazon/search/:query', {templateUrl: 'partials/amazon/search.html', controller: 'AmazonSearchResultController'});
		$routeProvider.when('/media/edit/:id', {templateUrl: 'partials/media/form.html', controller: 'MediaEditController'});
		$routeProvider.when('/media/:type', {templateUrl: 'partials/media/browse.html', controller: 'MediaListController'});
		$routeProvider.when('/media', {templateUrl: 'partials/media/browse.html', controller: 'MediaListController'});
		$routeProvider.otherwise({redirectTo: '/media'});
	}]);

var controllersModule = angular.module('medienverwaltung.controllers', []);

//    $('#openid-login').click(function(){
//        var url = $('#openid-provider-url').val();
//        url = url.replace('%USER%', $('#openid-username').val());
//
//        $('#openid').val(url);
//        $('#signin-form').submit();
//        return false;
//    });
//
//    function hideLoginEntry() {
//        $('#openid-prompt').hide();
//    }
//
//    function showLoginPrompt(providerId, providerName, providerUrl) {
//        $('#openid-prompt').show();
//        $('#openid-provider-prompt').html("Your " + providerName + " Account: ");
//        $('#openid-username').val('');
//        $('#openid-provider-url').val(providerUrl);
//
//    }
//
//    function signin(provider) {
//        hideLoginEntry();
//
//        if(provider == 'openid') {
//            $('#openid').val('');
//        }
//        else if(provider == 'google') {
//            $('#openid').val('https://www.google.com/accounts/o8/id');
//            $('#signin-form').submit();
//        }
//        else if(provider == 'yahoo') {
//            $('#openid').val('http://yahoo.com/');
//            $('#signin-form').submit();
//        }
//        else if(provider == 'aol') {
//            showLoginPrompt(provider, 'AOL', 'http://openid.aol.com/%USER%');
//        }
//        else if(provider == 'myopenid') {
//            $('#openid').val('http://myopenid.com/');
//            $('#signin-form').submit();
//        }
//        else if(provider == 'myspace') {
//            $('#openid').val('http://myspace.com/');
//            $('#signin-form').submit();
//        }
//        else if(provider == 'livejournal') {
//            showLoginPrompt(provider, 'Livejournal', 'http://%USER%.livejournal.com/');
//        }
//        else if(provider == 'flickr') {
//            showLoginPrompt(provider, 'Flickr', 'http://flickr.com/%USER%/');
//        }
//        else if(provider == 'technorati') {
//            showLoginPrompt(provider, 'Technorati', 'http://technorati.com/people/technorati/%USER%/');
//        }
//        else if(provider == 'wordpress') {
//            showLoginPrompt(provider, 'Wordpress.com', 'http://%USER%.wordpress.com//');
//        }
//        else if(provider == 'blogger') {
//            showLoginPrompt(provider, 'Blogger', 'http://%USER%.blogspot.com/');
//        }
//        else if(provider == 'verisign') {
//            showLoginPrompt(provider, 'Verisign', 'http://%USER%.pip.verisignlabs.com/');
//        }
//        else if(provider == 'vidoop') {
//            showLoginPrompt(provider, 'Vidoop', 'http://%USER%.myvidoop.com/');
//        }
//        else if(provider == 'claimid') {
//            showLoginPrompt(provider, 'ClaimID', 'http://openid.claimid.com/%USER%');
//        }
//    }
