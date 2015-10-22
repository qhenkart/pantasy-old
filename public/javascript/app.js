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
      url: '/app',
      templateUrl: '../templates/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('pant', {
      url: '/p/:slug',
      templateUrl: '../templates/pant.html',
      controller: 'PantController',
      controllerAs: 'pant'
    })
    $urlRouterProvider.otherwise('/app')
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



