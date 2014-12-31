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
  .service('fileUpload', ['$http', function($http) {
      this.uploadFileToUrl = function(file, uploadUrl) {
          var fd = new FormData();
          fd.append('data', file);
          $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined},
          })
          .success(function(){
          })
          .error(function(){
          });
      }
   }]);


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
            return $http.get('general_advisory.json');
        };
    
        var getProvinceGeoJSON = function() {
            return $http.get('provinces.json');
        };
    
        var getMunicipalityGeoJSON = function() {
            return $http.get('municipal.geojson');
        };
    
        var getProvinceIndex = function() {
            return $http.get('provinceindex.json');
        };
    
        var getMunicipalIndex = function() {
            return $http.get('municipalindex.json');
        };
    
        var getProvinceNames = function() {
            return $http.get('provincenames.json');
        };

        return {
            getGaleWarning: getGaleWarning,
            getRainfallAdvisory: getRainfallAdvisory,
            getLandslides: getLandslides,
            getFlooding: getFlooding,
            getStormSurge: getStormSurge,
            getPublicStormSignal: getPublicStormSignal,
            getGeneralAdvisory: getGeneralAdvisory,
            getProvinceGeoJSON: getProvinceGeoJSON,
            getMunicipalityGeoJSON: getMunicipalityGeoJSON,
            getProvinceIndex: getProvinceIndex,
            getMunicipalIndex: getMunicipalIndex,
            getProvinceNames: getProvinceNames
        };
  })
