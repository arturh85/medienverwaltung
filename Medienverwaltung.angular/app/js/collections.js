// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('medienverwaltung.collections', ['ngResource']).
    factory('MediaCollection', function($resource) {
        // https://api.mongolab.com/api/1/databases/medienverwaltung/collections/media?view=admin&apiKey=4f91ad72e4b00a1241478098
        var MediaCollection = $resource('https://api.mongolab.com/api/1/databases' +
            '/medienverwaltung/collections/media/:id',
            { apiKey: '4f91ad72e4b00a1241478098' }, {
                update: { method: 'PUT' }
            }
        );

        MediaCollection.prototype.update = function(cb) {
            return MediaCollection.update({id: this._id.$oid},
                angular.extend({}, this, {_id:undefined}), cb);
        };

        MediaCollection.prototype.destroy = function(cb) {
            return MediaCollection.remove({id: this._id.$oid}, cb);
        };

        return MediaCollection;
    });
