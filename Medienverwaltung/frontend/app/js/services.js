(function () {
    "use strict";

    // Demonstrate how to register services
    // In this case it is a simple constant service.
    var serviceModule = angular.module('medienverwaltung.services', []);

    // version value service
    serviceModule.value('version', '0.1');
}());
