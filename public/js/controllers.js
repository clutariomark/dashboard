'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });
}

function MyCtrl1($scope, Data, $q, $filter) {
    /* DATA INITIALIZATION */
    $scope.data = [];
    $scope.treedata = [];
    $scope.dates = [];
    $scope.col_defs = [];
    $scope.expanding_property='location';
    
    /* AUTO-REFRESH TIMER CURRENT SETTINGS: refresh every 120 seconds */
    var timer = {
        interval: null,
        seconds: 120,
        
        start: function() {
            var self = this;
            this.interval = setInterval(function() {
                self.seconds--;
                
                if (self.seconds == 0){
                    $window.location.reload();
                }
            }, 1000);
        },
        
        stop: function() {
            window.clearInterval(this.interval)
        }
    }
    
    timer.start();
    
    /* FUNCTIONS - ADD DATA FROM JSON TO TREEGRID DATA */
    function addNewEntry(location_id, type, data) {
        var datum;
        var value = data.value + ' ' + data.unit + ', ' + data.description;

        datum = {location: data.region};
        datum[type] = true;
        datum['children'] = [{location: data.province}];
        datum['children'][0][type] = true;
        datum['children'][0]['children'] = [{location: data.location}];
        datum['children'][0]['children'][0][type] = value;
        $scope.data.push(datum);
    }
    
    function doGaleWarning() {
        return Data.getGaleWarning()
            .then(function (data) {
                for (var index in data.data) {
                    var gale_warning = data.data[index];
                    addNewEntry(gale_warning.location_id, 'gale_warning', gale_warning);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_gale_warning = $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }

    function doRainfallAdvisory() {
        return Data.getRainfallAdvisory()
            .then(function (data) {
                for (var index in data.data) {
                    var rainfall_advisory = data.data[index];
                    addNewEntry(rainfall_advisory.location_id, 'rainfall_advisory', rainfall_advisory);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_rainfall_advisory = $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }

    function doLandslides() {
        return Data.getLandslides()
            .then(function (data) {
                for (var index in data.data) {
                    var landslide = data.data[index];
                    addNewEntry(landslide.location_id, 'landslide', landslide);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_landslides = $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }

    function doFlooding() {
        return Data.getFlooding()
            .then(function (data) {
                for (var index in data.data) {
                    var flooding = data.data[index];
                    addNewEntry(flooding.location_id, 'flooding', flooding);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_flooding = $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }

    function doStormSurge() {
        return Data.getStormSurge()
            .then(function (data) {
                for (var index in data.data) {
                    var storm_surge = data.data[index];
                    addNewEntry(storm_surge.location_id, 'storm_surge', storm_surge);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_storm_surge= $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }

    function doPublicStormSignal() {
        return Data.getPublicStormSignal()
            .then(function (data) {
                for (var index in data.data) {
                    var public_storm_signal = data.data[index];
                    addNewEntry(public_storm_signal.location_id, 'public_storm_signal', public_storm_signal);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_public_storm_signal = $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }

    function doGeneralAdvisory() {
        return Data.getGeneralAdvisory()
            .then(function (data) {
                for (var index in data.data) {
                    var generaladvisory = data.data[index];
                    addNewEntry(generaladvisory.location_id, 'generaladvisory', generaladvisory);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_general_advisory = $filter('date')(new Date(data.headers('last-modified')), 'short');
                console.log(data.headers('last-modified'));
                return data;
            }, function (error) {
                console.log(error);
            });
    }
    
    function mergePK(data) {
        var index = {}, result = [],
            key, src, dest;

        function copyProps(src, dest) {
            for (var key in src) {
                if (src.hasOwnProperty(key) && key !== "location" && key !== "children") {
                    dest[key] = src[key];
                }
            }
        }

        for (var i = 0; i < data.length; i++) {
            src = data[i];
            key = src.location;
            // see if we already have a value for this PK that we should use
            // or need to create a new one
            if (index.hasOwnProperty(key)) {
                dest = index[key];
                //console.log(index[key]);
            } else {
                index[key] = dest = {location: key};
                result.push(dest);
                //console.log({location:key});
            }
            // src is the object we're copying from
            // dest is the destination PK object that we want
            // to merge into

            // copy properties at the same level
            copyProps(src, dest);
            if (src.children && src.children.length) {
                // add merged children
                var mergedChildren = mergePK(src.children);
                //console.log(i + ' ' + mergedChildren);
                if (mergedChildren.length) {
                    if (!dest.children) {
                        dest.children = [];
                    }
                    //dest.children.push(mergedChildren);
                    dest.children.push.apply(dest.children, mergedChildren);
                }

            }
        }
        //console.log(index);
        //console.log(result[0]);
        return result;
    }
    
    $q.all([
        doPublicStormSignal(),
        doGaleWarning(),
        doRainfallAdvisory(),
        doFlooding(),
        doLandslides(),
        doStormSurge(),
        doGeneralAdvisory()
    ]).then(function (responses) {
        var tempdata;
        var temptempdata = [];
        tempdata = mergePK($scope.data);
        for (var i in tempdata){
            tempdata[i].children = mergePK(tempdata[i].children)
            for (var j in tempdata[i].children){
                tempdata[i].children[j].children = mergePK(tempdata[i].children[j].children);        
            }
            //console.log(tempdata[i]);
            temptempdata.push(tempdata[i]);
        }
        $scope.treedata = temptempdata;
        // you can now modify $scope.data here
        
        $scope.last_update = $filter('date')(new Date(Math.max.apply(null, $scope.dates)), 'short');
        
        $scope.col_defs.push({field:'public_storm_signal', displayName: 'Public Storm Signal (' + $scope.last_update_public_storm_signal + ')'});
        $scope.col_defs.push({field:'gale_warning', displayName: 'Gale Warning (' + $scope.last_update_gale_warning + ')'});
        $scope.col_defs.push({field:'rainfall_advisory', displayName: 'Rainfall Advisory (' + $scope.last_update_rainfall_advisory + ')'});
        $scope.col_defs.push({field:'flooding', displayName: 'Flooding (' + $scope.last_update_flooding + ')'});
        $scope.col_defs.push({field:'landslide', displayName: 'Landslide (' + $scope.last_update_landslides + ')'});
        $scope.col_defs.push({field:'storm_surge', displayName: 'Storm Surge (' + $scope.last_update_storm_surge + ')'});
        $scope.col_defs.push({field:'generaladvisory', displayName: 'General Advisory (' + $scope.last_update_general_advisory + ')'});       

    });
    
    
}
MyCtrl1.$inject = ['$scope', 'Data', '$q', '$filter'];


