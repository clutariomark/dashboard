'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');


angular.module('myApp.services')
  .factory('Config', function () {
     return {
      domain_url : document.location.origin,
      web_url: document.location.origin,
      api_url: document.location.origin + '/api'
     }
  });


angular.module('myApp.services')
  .factory('Data', function($http, Config){
    var getHighWinds = function(success, error) {
        $http.get(Config.api_url + '/data/high_winds').success(success).error(error);
      };

    var getStrongRains =  function(success, error) {
        $http.get(Config.api_url + '/data/strong_rains').success(success).error(error);
      };

    var getLandslides =  function(success, error) {
        $http.get(Config.api_url + '/data/landslide').success(success).error(error);
      };

    var getFlooding = function(success, error) {
        $http.get(Config.api_url + '/data/flooding').success(success).error(error);
      };

    var getStormSurge = function(success, error) {
        $http.get(Config.api_url + '/data/storm_surge').success(success).error(error);
      };

    var getPublicStormSignal = function(success, error) {
        $http.get(Config.api_url + '/data/public_storm_signal').success(success).error(error);
      };

    return {
      getHighWinds: getHighWinds,
      getStrongRains: getStrongRains,
      getLandslides: getLandslides,
      getFlooding: getFlooding,
      getStormSurge: getStormSurge,
      getPublicStormSignal: getPublicStormSignal
    };
  })
