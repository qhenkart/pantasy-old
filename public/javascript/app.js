'use strict';

angular.module('pantasy', ['ui.router', 
  'ui.bootstrap',
  'pantasy.main',
  'pantasy.pants',
  'ngMessages',
  'imageupload',
  'angularSpinner'
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
  $stateProvider
    .state('app', {
      url: '/p/home',
      templateUrl: '../templates/pant.html',
      controller: 'PantController',
      controllerAs: 'pant'
    })
    .state('pant', {
      url: '/p/:slug',
      templateUrl: '../templates/pant.html',
      controller: 'PantController',
      controllerAs: 'pant'
    })
    $urlRouterProvider.otherwise('/p/home')
    // $httpProvider.interceptors.push(function ($location) {
    //     return {
    //         request: function (config) {
    //             config.headers["RefererFullUrl"] = $location.absUrl();
    //             return config;
    //         }
    //     };
    // });

    // $locationProvider.html5Mode(true);
}])



