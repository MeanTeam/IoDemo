angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/userLogin.html',
        controller: 'loginCtrl'
      })

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })

      .state('tab.register', {
        url: '/register/:mode',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'registerCtrl'
          }
        }
      })

      .state('tab.createManager', {
        url: '/createManager',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/createManager.html',
            controller: 'createManagerCtrl'
          }
        }
      })

      .state('tab.deleteManager', {
        url: '/deleteManager',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/deleteManager.html',
            controller: 'deleteManagerCtrl'
          }
        }
      })

      .state('tab.reassignManager', {
        url: '/reassignManager',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/reassignManager.html',
            controller: 'reassignManagerCtrl'
          }
        }
      })

      .state('tab.signInSignOut', {
        url: '/signInSignOut',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/signInSignOut.html',
            controller: 'signInSignOutCtrl'
          }
        }
      })

      .state('tab.listSignins', {
        url: '/listSignins',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/listSignins.html',
            controller: 'listSigninsCtrl'
          }
        }
      });

    /*
     .state('tab.checkInCheckOut', {
     url: '/entries',
     views:{
     'tab-checkInCheckOut':
     {
     templateUrl: 'templates/checkInCheckOut.html',
     controller: 'checkInCheckOutCtrl'
     }
     }
     })

     .state('tab.userInfo', {
     url: '/userInfo',
     views:{
     'tab-checkInCheckOut':
     {
     templateUrl: 'templates/userInfo.html',
     controller: 'userInfoCtrl'
     }
     }
     })

     .state('tab.log', {
     url: '/log',
     views:{
     'tab-checkInCheckOut':
     {
     templateUrl: 'templates/log.html',
     controller: 'logCtrl'
     }
     }
     })
     */

    $urlRouterProvider.otherwise('/login');
    //$urlRouterProvider.otherwise('/tab/register/home')
    //$urlRouterProvider.otherwise('/tab/signInSignOut')

  });
