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

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2($scope, Data, $filter) {
  

  $scope.data = [];
  $scope.last_update = $filter('date')(new Date(), 'short');
  $scope.last_update_highwinds = $filter('date')(new Date(), 'short');
  $scope.last_update_strong_rains = $filter('date')(new Date(), 'short');
  $scope.last_update_flooding = $filter('date')(new Date(), 'short');
  $scope.last_update_landslides = $filter('date')(new Date(), 'short');
  $scope.last_update_storm_surge = $filter('date')(new Date(), 'short'); 
  $scope.last_update_public_storm_signal = $filter('date')(new Date(), 'short'); 

  $scope.aggAffectedProvince = function (row) {
    console.log(row);
    var datum = row.children[0].entity;
    var str = '';
    if(datum.highwinds && datum.highwinds.split(',')[0] > 500) {

      str += 'HW: ' + datum.location + '; ';
    }

    if(datum.strong_rains && datum.strong_rains.split(',')[0] > 500) {
      str += 'SR: ' + datum.location + '; ';
    }

    if(datum.flooding && datum.flooding.split(',')[0] > 500) {
      str += 'FL: ' + datum.location + '; ';
    }

    if(datum.landslide && datum.landslide.split(',')[0] > 500) {
      str += 'LS: ' + datum.location + '; ';
    }

    if(datum.storm_surge && datum.storm_surge.split(',')[0] > 500) {
      str += 'SS: ' + datum.location + '; ';
    }

    if(datum.public_storm_signal && datum.public_storm_signal.split(',')[0] > 500) {
      str += 'PSS: ' + datum.location + '; ';
    }

    return str;
  }

  $scope.aggGetRegionName = function (row) {
    return row.children[0].entity.region;
  }

  $scope.aggAffectedProvinceForType = function (type, row) {
    var datum = row.children[0].entity;
    var str = '';
    if(type == 'HW' && datum.highwinds && datum.highwinds.split(',')[0] > 500) {
      str += 'HW: ' + datum.location + '; ';
    }

    if(type == 'SR' && datum.strong_rains && datum.strong_rains.split(',')[0] > 500) {
      str += 'SR: ' + datum.location + '; ';
    }

    if(type == 'FL' && datum.flooding && datum.flooding.split(',')[0] > 500) {
      str += 'FL: ' + datum.location + '; ';
    }

    if(type == 'LS' && datum.landslide && datum.landslide.split(',')[0] > 500) {
      str += 'LS: ' + datum.location + '; ';
    }

    if(type == 'SS' && datum.storm_surge && datum.storm_surge.split(',')[0] > 500) {
      str += 'SS: ' + datum.location + '; ';
    }

    if(type == 'PSS' && datum.public_storm_signal && datum.public_storm_signal.split(',')[0] > 500) {
      str += 'PSS: ' + datum.location + '; ';
    }

    return str;
  }

  function addNewEntry(location_id, type, data) {
    var datum;
    var value = data.value + ', ' + data.description;
    for(var index in $scope.data) {
      datum = $scope.data[index];
      if(datum.location_id == location_id) {
        datum[type] = value;
        console.log(type, '<----');
        return;
      }
    }

    datum = {location_id: location_id, location: data.location, region: data.region};
    datum[type] = value;
    //just create a new entry
    $scope.data.push(datum);
  }
  
  function getHighWinds () {
    Data.getHighWinds(function (data) {
      for(var index in data) {
        var highwind = data[index];
        addNewEntry(highwind.location_id, 'highwinds', highwind);
      }

    }, function (error) {

    });
  }
  
  function getStrongRains () {
    Data.getStrongRains(function (data) {
      for(var index in data) {
        var strongRains = data[index];
        addNewEntry(strongRains.location_id, 'strong_rains', strongRains);
      }
    }, function (error) {
      console.log(error);
    });
  }

  function getLandslides () {
    Data.getLandslides(function (data) {
      for(var index in data) {
        var landslide = data[index];
        addNewEntry(landslide.location_id, 'landslide', landslide);
      }
    }, function (error) {
      console.log(error);
    });
  }

  function getFlooding() {
    Data.getFlooding(function (data) {
      for(var index in data) {
        var flooding = data[index];
        addNewEntry(flooding.location_id, 'flooding', flooding);
      }
    }, function (error) {
      console.log(error);
    });
  }

  function getStormSurge() {
    Data.getStormSurge(function (data) {
      for(var index in data) {
        var storm_surge = data[index];
        addNewEntry(storm_surge.location_id, 'storm_surge', storm_surge);
      }
    }, function (error) {
      console.log(error);
    });
  }

  function getPublicStormSignal() {
    Data.getPublicStormSignal(function (data) {
      for(var index in data) {
        var public_storm_signal = data[index];
        addNewEntry(public_storm_signal.location_id, 'public_storm_signal', public_storm_signal);
      }
    }, function (error) {
      console.log(error);
    });
  }

  getHighWinds();
  getStrongRains();
  getFlooding();
  getLandslides();
  getStormSurge();
  getPublicStormSignal();


  $scope.gridOptions = { data: 'data', 
                  groups: ['region'],
                  //aggregateTemplate: '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate"> <span class="ngAggregateText">{{row.label CUSTOM_FILTERS}} (provinces: {{row.totalChildren()}}; {{AggItemsLabel}} Affected provinces: {{aggAffectedProvince(row)}})</span> <div class="{{row.aggClass()}}"></div> </div>',
                  aggregateTemplate: '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate"> '+
                                        '<div class="red regionHeader">Region {{aggGetRegionName(row)}}</div> '+
                                        '<div class="group otherHeader"></div> '+
                                        '<div class="group otherHeader">{{aggAffectedProvinceForType("HW", row)}}</div> '+
                                        '<div class="group otherHeader">{{aggAffectedProvinceForType("SR", row)}}</div> '+
                                        '<div class="group otherHeader">{{aggAffectedProvinceForType("FL", row)}}</div> '+
                                        '<div class="group otherHeader">{{aggAffectedProvinceForType("LS", row)}}</div> '+
                                        '<div class="group otherHeader">{{aggAffectedProvinceForType("SS", row)}}</div> '+
                                        '<div class="group otherHeader">{{aggAffectedProvinceForType("PSS", row)}}</div> '+
                                        '</div> '+
                                        '</div>',
                  columnDefs : [{field: 'region', displayName: 'Region', width: 60},
                                {field: 'location', displayName: 'Location'},
                                {field: 'highwinds', displayName: 'Highwinds(' + $scope.last_update_highwinds + ')'},
                                {field: 'strong_rains', displayName: 'Strong Rains (' + $scope.last_update_highwinds + ')'},
                                {field: 'flooding', displayName: 'Flooding (' + $scope.last_update_highwinds + ')'},
                                {field: 'landslide', displayName: 'Landslides (' + $scope.last_update_highwinds + ')'},
                                {field: 'storm_surge', displayName: 'Storm Surge (' + $scope.last_update_storm_surge + ')'},
                                {field: 'public_storm_signal', displayName: 'Public Storm Signal (' + $scope.last_update_public_storm_signal + ')'}
                                ]
                        };

  $('.gridStyle').css('height', window.screen.height);
}
MyCtrl2.$inject = ['$scope', 'Data', '$filter'];
