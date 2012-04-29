(function () {
    "use strict";

    describe('my app', function() {

      beforeEach(function() {
        browser().navigateTo('../../app/index.html');
      });


      it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
        expect(browser().location().url()).toBe("/view1");
      });


      describe('media', function() {

        beforeEach(function() {
          browser().navigateTo('#/media');
        });


        it('should render media/browse when user navigates to /media', function() {
          expect(element('[ng-view] p:first').text()).
            toMatch(/Media:/);
        });

      });

        /*
         it('should filter the phone list as user types into the search box', function() {
         expect(repeater('.phones li').count()).toBe(3);

         input('query').enter('nexus');
         expect(repeater('.phones li').count()).toBe(1);

         input('query').enter('motorola');
         expect(repeater('.phones li').count()).toBe(2);
         });
         */

    });
}());
