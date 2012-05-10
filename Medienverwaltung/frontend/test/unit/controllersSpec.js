/*global MediaListController: true */

(function () {
    "use strict";


    /* jasmine specs for controllers go here */
    describe('controllers', function() {

        beforeEach(function(){
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        beforeEach(module('medienverwaltung.services'));

        describe('MediaListController', function () {
            var scope, ctrl, $httpBackend;

            beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, $route) {
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET('api/media').
                    respond([
                    {isbn:'3442369673'},
                    {isbn:'3442369681'}
                ]);

                scope = $rootScope.$new();
                ctrl = $controller(MediaListController, {$scope: scope, $route: $route});
            }));

            it('should create "media" model with 2 media fetched from xhr', function() {
                expect(scope.media).toEqual([]);
                $httpBackend.flush();

                expect(scope.media).toEqualData(
                    [{isbn: '3442369673'}, {isbn: '3442369681'}]);
            });
        });
    });
}());
