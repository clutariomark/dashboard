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

function MyCtrl1($scope, Data, $q, $filter, leafletEvents, leafletData, fileUpload, $window, $location, $anchorScroll) {
    
    /* DATA INITIALIZATION */
    $scope.data = [];
    $scope.treedata = [];
    $scope.dates = [];
    $scope.col_defs = [];
    
    $scope.expanding_property='location';
    $scope.my_tree_handler = function(branch){
    	console.log('you clicked on', branch)
    }
    
    
        
    /* AUTO-REFRESH TIMER CURRENT SETTINGS: refresh every 120 seconds */
    $scope.timer = {
        interval: null,
        seconds: 3600,
        
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
            $window.clearInterval(this.interval);
            $scope.timer.start();
        }
    }
    
    $scope.timer.start();
    
    /* UPLOAD AND DOWNLOAD DATA */
    var datatype = ['gale_warning', 'public_storm_signal', 'flooding', 'landslide', 'rainfall_advisory', 'storm_surge', 'general_advisory'];
    
    $scope.showModal = false;
    $scope.toggleModal = function() {
        $scope.showModal = !$scope.showModal;
        var password = $scope.loginpassword;
        console.log(password);
    };
    
    $scope.upload = function(password) {
        console.log(password);
        console.log($scope.myFile);
        setTimeout(function () {
            if(password === "dost_pagasa") {
            var file = $scope.myFile;
                console.log(file);
                if(typeof file !== "undefined") {
                  var uploadtype = $window.prompt("Select Data Type.");
                  console.log('controller: file is ' + JSON.stringify(file));
                  console.log(uploadtype);
                  if(datatype.indexOf(uploadtype) > -1) {
                      var uploadpath = document.location.origin + '/api/submit/' + uploadtype;
                      var goupload = $window.confirm('Upload ' + uploadtype + ' file?');
                      if (goupload === true) {
                          fileUpload.uploadFileToUrl(file, uploadpath);
                          $window.location.reload();
                      }
                  } else {
                      $window.alert("Data type not supported.");
                  }
                } else {
                  $window.alert("No file chosen.");
                }
            } else {
                $window.alert("You do not have permission to upload files");
            }
            $scope.showModal = false;
        }, 0);
    };
    
    $scope.download = function() {
        setTimeout(function() {
            var downloadtype = $window.prompt("Select Data Type.");
            var downloadpath = document.location.origin + '/api/data/' + downloadtype;
            if(datatype.indexOf(downloadtype) > -1) {
                $window.open(downloadpath, '_blank', '');
            } else {
                $window.alert("Data type not supported.");
            }
        }, 0);
    };
    
    /* FUNCTIONS - ADD DATA FROM JSON TO TREEGRID DATA */
    function addNewEntry(location_id, type, data) {
        var datum;
        var value = data.value + ' ' + data.unit + ', ' + data.description.split('\r')[0];

        datum = {location: data.region};
        datum[type] = 'warning uploaded';
        datum['children'] = [{location: data.province}];
        datum['children'][0][type] = 'warning uploaded';
        datum['children'][0]['children'] = [{location: data.location}];
        datum['children'][0]['children'][0][type] = value;
        $scope.data.push(datum);
    }
    
    function addGeoJSONEntry(attr, data) {
        var datum;
        datum = data.description.split("\r")[0];
        $scope.geojson.data.features[Number($scope.provinceindex[data.province])].properties[attr].push(datum);
        if (data.location === "All Cities and Municipalities") {
            var province = $scope.provincenames[data.province];
            for (var i = 0; i < province.length; i++) {
                var indexmunicipal = province[i] + ", " + data.province;
                $scope.geojsonmunicipality.data.features[Number($scope.municipalindex[indexmunicipal])].properties[attr].push(datum);
            }
        } else {
            var indexmunicipal = data.location + ", " + data.province;
            $scope.geojsonmunicipality.data.features[Number($scope.municipalindex[indexmunicipal])].properties[attr].push(datum);
        }
    }
    
    function doGaleWarning() {
        return Data.getGaleWarning()
            .then(function (data) {
                for (var index in data.data) {
                    var gale_warning = data.data[index];
                    addNewEntry(gale_warning.location_id, 'gale_warning', gale_warning);
                    addGeoJSONEntry('GW', gale_warning);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_gale_warning = $filter('date')(new Date(data.headers('last-modified')), 'short');
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
                    addGeoJSONEntry('RA', rainfall_advisory);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_rainfall_advisory = $filter('date')(new Date(data.headers('last-modified')), 'short');
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
                    addGeoJSONEntry('L', landslide);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_landslides = $filter('date')(new Date(data.headers('last-modified')), 'short');
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
                    addGeoJSONEntry('F', flooding);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_flooding = $filter('date')(new Date(data.headers('last-modified')), 'short');
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
                    addGeoJSONEntry('SS', storm_surge);
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
                    addGeoJSONEntry('PSS', public_storm_signal);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_public_storm_signal = $filter('date')(new Date(data.headers('last-modified')), 'short');
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
                    addGeoJSONEntry('GA', generaladvisory);
                }
                $scope.dates.push(new Date(data.headers('last-modified')));
                $scope.last_update_general_advisory = $filter('date')(new Date(data.headers('last-modified')), 'short');
                return data;
            }, function (error) {
                console.log(error);
            });
    }
    
    /* FUNCTION TO MERGE ALL DATA INTO TREEGRID */
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
        return result;
    }
    
    /* LEAFLET FUNCTIONALITIES */
    $scope.philippines = {
        lat: 12.987623,
        lng: 124,
        zoom: 6
    };
    
    $scope.defaults = {
        minZoom: 6
    };
    
    $scope.eventDetected = "No events yet...";
    var mapEvents = leafletEvents.getAvailableMapEvents();
    for (var k in mapEvents) {
        var eventName = 'leafletDirectiveMap.' + mapEvents[k];
        $scope.$on(eventName, function(event) {
            $scope.eventDetected = event.name;
        });
    }
    
    $scope.$on("leafletDirectiveMap.mousemove", function(ev, args) {
        $scope.timer.stop();
    });
    
    $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, leafletEvent) {
        $scope.timer.stop();
        provinceMouseover(leafletEvent);
    });
    
    $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
        $scope.timer.stop();
        provinceClick(featureSelected, leafletEvent);
    });
    
    $scope.$on("leafletDirectiveMap.click", function(event, args) {
        var latlong = args.leafletEvent.latlng;
        console.log('Lat: ' + latlong.lat + ' Lng: ' + latlong.lng);
    });
    
    function provinceMouseover(leafletEvent) {
        var layer = leafletEvent.target;
            layer.setStyle({
                weight: 2,
                color: '#666',
                fillOpacity: 0.0,
                fillColor: 'black'
            });
            layer.bringToFront();
    }
    
    function provinceClick(feature, leafletEvent) {
        console.log(feature);
        leafletData.getMap().then(function(map) {
            map.fitBounds(leafletEvent.target.getBounds());
        });
    }
    
    $scope.mapMunicipal = function() {
        $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonmunicipality' legend='legend' events='events'></leaflet>";
    };
    
    $scope.mapProvince = function() {
        $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojson' legend='legend' events='events'></leaflet>";
    }

    function getProvinceJSON() {
        return Data.getProvinceGeoJSON()
            .then(function (data){
                var jsondata;
                jsondata = {data: data.data,
                            resetStyleOnMouseout: true
                           };
                return jsondata;
        }, function (error) {
            console.log(error);
        });
    }
    
    function getMunicipalityJSON() {
        return Data.getMunicipalityGeoJSON()
            .then(function (data){
                var jsondata;
                jsondata = {data: data.data,
                            /*style: {
                                fillColor: "blue",
                                weight: 1,
                                opacity: 1,
                                color: 'white',
                                dashArray: '3',
                                fillOpacity: 0.5
                            },*/
                            resetStyleOnMouseout: true
                           };
                return jsondata;
        }, function (error) {
            console.log(error);
        });
    }
    
    var signalcolor = {
        "signal #1": "yellow",
        "signal #2": "orange",
        "signal #3": "red",
        "signal #4": "#4B0082"
    }
    
    var stormsurgecolor = {
        "SSA #1": "yellow",
        "SSA #2": "orange",
        "SSA #3": "red",
        "SSA #4": "#4B0082"
    }
    
    var othercolor = {
        "low risk": "yellow",
        "medium risk": "orange",
        "high risk": "red"
    }
    
    function getStyle(feature){
        var colorindex = feature.properties[$scope.leafletprop].reverse();
        //colorindex.reverse();
        var maincolor;
        if ($scope.leafletprop === "PSS") {
            maincolor = signalcolor[colorindex[0]]||"blue";
        } else if ($scope.leafletprop === "SS") {
            maincolor = stormsurgecolor[colorindex[0]]||"blue";
        } else {
            maincolor = othercolor[colorindex[0]]||"blue";
        }
        return {
            fillColor: maincolor,
            weight: 1,
            opacity: 1,
            color: 'white',
            //dashArray: '3',
            fillOpacity: 0.5
        };
    }
            
    function getProvinceIndex() {
        return Data.getProvinceIndex()
            .then(function (data) {
                //$scope.provinceindex = data.data;
                return data.data;
        }, function (error) {
            console.log(error);
        });
    }             
    
    function getMunicipalIndex() {
        return Data.getMunicipalIndex()
            .then(function (data) {
                return data.data;
        }, function (error) {
            console.log(error);
        });
    }
    
    function getProvinceNames() {
        return Data.getProvinceNames()
            .then(function (data) {
                return data.data;
        }, function (error) {
            console.log(error);
        });
    }
    
    $scope.showMap = true;
    $scope.$watch("showMap", function(value) {
        if (value === false) {
            leafletData.getMap().then(function(map) {
                map.invalidateSize();
            });
        }
        $location.hash('map');
        $anchorScroll();
    });
    
    $scope.showInfo = true;
    
    var geoProvinceJSON = getProvinceJSON();
    geoProvinceJSON.then(function(provincedata) {
        var provincelist = getProvinceIndex();       
        provincelist.then(function(listprovince) {
            var geoMunicipalJSON = getMunicipalityJSON();
            geoMunicipalJSON.then(function(municipaldata) {
                var municipallist = getMunicipalIndex();
                municipallist.then(function(listmunicipal) {
                    var provincenames = getProvinceNames();
                    provincenames.then(function(namedata) {
                        $scope.provincenames = namedata;
                        $scope.geojson = provincedata;
                        $scope.provinceindex = listprovince;                
    /*                    $scope.geojson.onEachFeature = function(feature, layer) {
                            layer.setStyle(getStyle(feature));
                        }*/
                        $scope.geojsonmunicipality = municipaldata;
                        $scope.municipalindex = listmunicipal;
                        $scope.geojson.style = getStyle;
                        $scope.geojsonmunicipality.style = getStyle;
                        $q.all([
                            doPublicStormSignal(),
                            doGaleWarning(),
                            doRainfallAdvisory(),
                            doFlooding(),
                            doLandslides(),
                            doStormSurge(),
                            doGeneralAdvisory()
                        ]).then(function (responses) {
                            $scope.leafletprop = "PSS";
                            $scope.$watch("leafletprop", function(value) {
                                $scope.leafletprop = value;
                                if (value === "PSS") {
                                    $scope.geojsonPSS = $scope.geojson;
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["#4B0082", "red", "orange", "yellow", "blue"],
                                        labels: ["Signal #4", "Signal #3", "Signal #2", "Signal #1", "No Storm Signal"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonPSS' legend='legend' events='events'></leaflet>";
                                }
                                if (value === "GW") {
                                    $scope.geojsonGW = $scope.geojson;
                                    $scope.legend = {};
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["red", "orange", "yellow", "blue"],
                                        labels: ["High Risk", "Medium Risk", "Low Risk", "No Risk"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonGW' legend='legend' events='events'></leaflet>";
                                }

                                if (value === "RA") {
                                    $scope.geojsonRA = $scope.geojson;
                                    $scope.legend = {};
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["red", "orange", "yellow", "blue"],
                                        labels: ["High Risk", "Medium Risk", "Low Risk", "No Risk"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonRA' legend='legend' events='events'></leaflet>";
                                }

                                if (value === "F") {
                                    $scope.geojsonF = $scope.geojson;
                                    $scope.legend = {};
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["red", "orange", "yellow", "blue"],
                                        labels: ["High Risk", "Medium Risk", "Low Risk", "No Risk"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonF' legend='legend' events='events'></leaflet>";
                                }

                                if (value === "L") {
                                    $scope.geojsonL = $scope.geojson;
                                    $scope.legend = {};
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["red", "orange", "yellow", "blue"],
                                        labels: ["High Risk", "Medium Risk", "Low Risk", "No Risk"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonL' legend='legend' events='events'></leaflet>";
                                }

                                if (value === "SS") {
                                    $scope.geojsonSS = $scope.geojson;
                                    $scope.legend = {};
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["#4B0082", "red", "orange", "yellow", "blue"],
                                        labels: ["SSA #4", "SSA #3", "SSA #2", "SSA #1", "No Storm Surge Warning"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonSS' legend='legend' events='events'></leaflet>";
                                }

                                if (value === "GA") {
                                    $scope.geojsonGA = $scope.geojson;
                                    $scope.legend = {};
                                    $scope.legend = {
                                        position: "topleft",
                                        colors: ["red", "orange", "yellow", "blue"],
                                        labels: ["High Risk", "Medium Risk", "Low Risk", "No Risk"]
                                    };
                                    $scope.leafletcompile = "<leaflet defaults='defaults' center='philippines' geojson='geojsonGA' legend='legend' events='events'></leaflet>";
                                }

                                console.log($scope.leafletprop);
                                console.log($scope.legend);
                            });

                            var tempdata;
                            var temptempdata = [];
                            tempdata = mergePK($scope.data);
                            for (var i in tempdata){
                                tempdata[i].children = mergePK(tempdata[i].children)
                                for (var j in tempdata[i].children){
                                    tempdata[i].children[j].children = mergePK(tempdata[i].children[j].children);        
                                }
                                temptempdata.push(tempdata[i]);
                            }
                            $scope.treedata = temptempdata;
                            // you can now modify $scope.data here
                            // console.log($scope.geojson.data.features[Number($scope.provinceindex['Bulacan'])].properties);
                            console.log($scope.municipalindex);
                            $scope.last_update = $filter('date')(new Date(Math.max.apply(null, $scope.dates)), 'short');
                            $scope.col_defs.push({field:'public_storm_signal', displayName: 'Public Storm Signal (' + $scope.last_update_public_storm_signal + ')'});
                            $scope.col_defs.push({field:'gale_warning', displayName: 'Gale Warning (' + $scope.last_update_gale_warning + ')'});
                            $scope.col_defs.push({field:'rainfall_advisory', displayName: 'Rainfall Advisory (' + $scope.last_update_rainfall_advisory + ')'});
                            $scope.col_defs.push({field:'flooding', displayName: 'Flooding (' + $scope.last_update_flooding + ')'});
                            $scope.col_defs.push({field:'landslide', displayName: 'Landslide (' + $scope.last_update_landslides + ')'});
                            $scope.col_defs.push({field:'storm_surge', displayName: 'Storm Surge (' + $scope.last_update_storm_surge + ')'});
                            $scope.col_defs.push({field:'generaladvisory', displayName: 'General Advisory (' + $scope.last_update_general_advisory + ')'});
                        });
                    });
                });
            });
        });
    });
}
MyCtrl1.$inject = ['$scope', 'Data', '$q', '$filter', 'leafletEvents', 'leafletData', 'fileUpload', '$window', '$location', '$anchorScroll'];