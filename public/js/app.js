'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute', 'ngGrid']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/hrs_6', {templateUrl: 'partial/dashboard', controller: MyCtrl2});
    $routeProvider.when('/hrs_12', {templateUrl: 'partial/dashboard', controller: MyCtrl2});
    $routeProvider.when('/hrs_24', {templateUrl: 'partial/dashboard', controller: MyCtrl2});
    $routeProvider.when('/current', {templateUrl: 'partial/dashboard', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/current'});
    $locationProvider.html5Mode(true);
  }]);