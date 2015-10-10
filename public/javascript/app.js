'use strict';

angular.module('pantasy', ['ui.router', 'ui.bootstrap'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
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
    $urlRouterProvider.otherwise('/app');
}])


