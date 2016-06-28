angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tab',{
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('login', {
    url: '/login',
    cache: false,
    views:{
      'menuContent':{
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('tab.register', {
    url: '/register',
    cache: false,
    views:{
      'menuContent':{
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
      }
    }
  })

  .state('tab.signInSignOut', {
    url: '/signInSignOut',
    cache: false,
    views:{
      'menuContent':{
        templateUrl: 'templates/signInSignOut.html',
        controller: 'signInSignOutCtrl'
      }
    }
  })

  .state('tab.listSignins', {
    url: '/listSignins',
    cache: false,
    views:{
      'menuContent':{
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

  //$urlRouterProvider.otherwise('/login')
  $urlRouterProvider.otherwise('/tab/register')
  //$urlRouterProvider.otherwise('/tab/signInSignOut')

});
