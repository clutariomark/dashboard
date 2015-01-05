'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

angular.module('myApp.directives').
    directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

angular.module('myApp.directives').
    directive('compile', function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },

                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    });

angular.module('myApp.directives').
    directive('modal', function() {
        return {
            template: '<div class="modal fade">' + 
                '<div class="modal-dialog">' + 
                    '<div class="modal-content">' + 
                        '<div class="modal-header">' + 
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                            '<h4 class="modal-title">{{ title }}</h4>' + 
                        '</div>' + 
                        '<div class="modal-body" ng-transclude></div>' + 
                    '</div>' + 
                '</div>' + 
            '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;
            
                scope.$watch(attrs.visible, function(value) {
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });
                
                $(element).on('shown.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = true;
                    });
                });
                
                $(element).on('hidden.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
});