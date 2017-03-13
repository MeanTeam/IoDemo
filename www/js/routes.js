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
      })

      .state("tab.geofences", {
        url: "/geofences",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/geofences.html",
            controller: "GeofencesCtrl"
          }
        }
      })

      .state("tab.geofence-new", {
        url: "/geofence/new/:longitude,:latitude",

        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/geofence.html",
            controller: "GeofenceCtrl",

            resolve: {
              geofence: function ($stateParams, Geofence) {
                return Geofence.create({
                  longitude: parseFloat($stateParams.longitude),
                  latitude: parseFloat($stateParams.latitude)
                });
              }
            }
          }
        }
      })

      .state("tab.geofence-edit", {
        url: "geofence/:geofenceId",

        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/geofence.html",
            controller: "GeofenceCtrl",

            resolve: {
              geofence: function ($stateParams, Geofence, $q) {
                var geofence = Geofence.findById($stateParams.geofenceId);

                if (geofence) {
                  return $q.when(angular.copy(geofence));
                }

                return $q.reject("Cannot find geofence with id: " + $stateParams.geofenceId);
              }
            }
          }
        }
      });

    $urlRouterProvider.otherwise('/login');

  });
