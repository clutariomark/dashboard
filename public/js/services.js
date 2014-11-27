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
        var getGaleWarning = function() {
            //return $http.get(Config.api_url + '/data/gale_warning');
            return $http.get('gale_warning.json');
        };

        var getRainfallAdvisory =  function() {
            //return $http.get(Config.api_url + '/data/rainfall_advisory');
            return $http.get('rainfall_advisory.json');
        };

        var getLandslides =  function() {
            //return $http.get(Config.api_url + '/data/landslide');
            return $http.get('landslide.json');
        };

        var getFlooding = function() {
            //return $http.get(Config.api_url + '/data/flooding');
            return $http.get('flooding.json');
        };

        var getStormSurge = function() {
            //return $http.get(Config.api_url + '/data/storm_surge');
            return $http.get('storm_surge.json');
        };

        var getPublicStormSignal = function() {
            //return $http.get('public_storm_signal.json');
            return $http.get('public_storm_signal.json');
        };

        var getGeneralAdvisory = function() {
            //return $http.get(Config.api_url + '/data/generaladvisory');
            return $http.get('generaladvisory.json');
        };

        return {
            getGaleWarning: getGaleWarning,
            getRainfallAdvisory: getRainfallAdvisory,
            getLandslides: getLandslides,
            getFlooding: getFlooding,
            getStormSurge: getStormSurge,
            getPublicStormSignal: getPublicStormSignal,
            getGeneralAdvisory: getGeneralAdvisory
        };
  })
