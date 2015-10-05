'use strict';

angular.module('pantasy', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('app', {
      url: '/app',
      templateUrl: '../templates/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    $urlRouterProvider.otherwise('/app');
}])