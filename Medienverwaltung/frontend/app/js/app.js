/*global LoginController: true, MediaEditController: true, MediaListController: true */

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
        $routeProvider.when('/profile/:id', {template: 'partials/profile.html', controller: ProfileController});
        $routeProvider.when('/profile', {template: 'partials/prfile.html', controller: ProfileController});
        $routeProvider.when('/amazon/search/:query', {template: 'partials/amazon/search.html', controller: AmazonSearchController});
        $routeProvider.when('/media/edit/:id', {template: 'partials/media/form.html', controller: MediaEditController});
        $routeProvider.when('/media/:type', {template: 'partials/media/browse.html', controller: MediaListController});
        $routeProvider.when('/media', {template: 'partials/media/browse.html', controller: MediaListController});
        $routeProvider.otherwise({redirectTo: '/media'});
    }]);

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

}());
