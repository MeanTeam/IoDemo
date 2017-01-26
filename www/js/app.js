// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'app.listSignins', 'app.signInSignOut', 'app.deleteManager', 'app.createManager',
  'app.menu', 'app.login', 'app.register', 'app.routes', 'app.services', 'app.directives', 'app.reassignManager', 'ui.mask', 'ngCordova',
  'app.leaflet-directive', 'app.geofences', 'app.geofence'
])

  .run(function ($ionicPlatform, $log, $rootScope, $window, $state,
                 GeofencePluginMock) {

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      // ------ Geofence ------
      if ($window.geofence === undefined) {
        $log.warn("Geofence Plugin not found. Using mock instead.");
        $window.geofence = GeofencePluginMock;
        $window.TransitionType = GeofencePluginMock.TransitionType;
      }

      $window.geofence.onTransitionReceived = function (geofences) {
        $log.log(geofences);
        if (geofences) {
          $rootScope.$apply(function () {
            geofences.forEach(function (geo) {
              geo.notification = geo.notification || {
                  title: "Geofence transition",
                  text: "Without notification"
                };
              $ionicLoading.show({
                template: geo.notification.title + ": " + geo.notification.text,
                noBackdrop: true,
                duration: 2000
              });
            });
          });
        }
      };

      $window.geofence.onNotificationClicked = function (notificationData) {
        $log.log(notificationData);

        if (notificationData) {
          $rootScope.$apply(function () {
            $ionicLoading.show({
              template: "Notification clicked: " + notificationData.notification.text,
              noBackdrop: true,
              duration: 2000
            });

            $state.go("geofence", {
              geofenceId: notificationData.id
            });
          });
        }
      };

      $window.geofence.initialize(function () {
        $log.log("Geofence plugin initialized");
      });
    });

    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
      $log.log("stateChangeError ", error, toState, toParams, fromState, fromParams);
      $state.go("geofences");
    });

  })

  .filter('tel', function () {
    return function (tel) {
      if (!tel) {
        return '';
      }

      var value = tel.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
        return tel;
      }

      var country, city, number;

      switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
          country = 1;
          city = value.slice(0, 3);
          number = value.slice(3);
          break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
          country = value[0];
          city = value.slice(1, 4);
          number = value.slice(4);
          break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
          country = value.slice(0, 3);
          city = value.slice(3, 5);
          number = value.slice(5);
          break;

        default:
          return tel;
      }

      if (country == 1) {
        country = "";
      }

      number = number.slice(0, 3) + '-' + number.slice(3);

      return (country + " (" + city + ") " + number).trim();
    };


  });
