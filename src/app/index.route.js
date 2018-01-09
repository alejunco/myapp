(function () {
    'use strict';
  
    angular
      .module('myapp')
      .config(routerConfig);
  
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/home/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        });
  
      $urlRouterProvider.otherwise('/');
    }
  
  })();
  