'use strict';

angular.module('app').config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/intro', {
            template: '<intro></intro>'
        })
        .when('/map', {
            template: '<map></map>'
        })
        .when('/battle-ground', {
            template: '<battle-ground></battle-ground>'
        })
        .when('/victory', {
            template: '<victory></victory>'
        })
        .when('/instructions', {
            template: '<instructions></instructions>'
        })
        .when('/characters', {
            template: '<characters></characters>'
        })
        .otherwise({
            redirectTo: '/intro'
        });
}]);