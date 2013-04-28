Medienverwaltung
================

Software to manage your media.
 - Easily scan the media items with barcodes you have via an Android or Desktop application (planned!)
 - Fetch information about the media via Amazon Product API (more planned!)
 - Use the [cloud server](http://www.medienverwaltung.net) or host your own instance
 - Open Source Software under MIT license

State: Proof of concept, early stage.

Using the code
--------------

### Required Software for development:
* http://nodejs.org/
* http://www.mongodb.org/
* http://code.google.com/p/js-test-driver/

### Framework:
* http://angularjs.org/

Setting up development environment:
-----------------------------------

* install nodejs
* install/start mongodb
* cd to backend directory of angular project
* copy config.sample.json to config.json and add your Amazon API secrets
* run 'npm install -d'
* run 'node backend.js'
* (optionally) run 'npm install -g supervisor' and use 'supervisor backend.js' to reload changes automatically
* open http://localhost:3000 in browser

Credits
-------

Credits to [dummy3k](https://github.com/dummy3k/medienverwaltung) for layout and idea

### Libraries:
* http://heartcode.robertpataki.com/canvasloader/  
* http://pivotal.github.com/jasmine/
* http://mongoosejs.com/
* http://expressjs.com/
* https://github.com/livelycode/aws-lib
* https://github.com/robertjd/everyauth/
* http://jquery.com/
