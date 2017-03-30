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

  .run(function ($ionicPlatform, $log, $rootScope, $window, $state, $ionicLoading, $ionicPopup,
                 GeofencePluginMock, GeoLocations, Geofence, ProfileFactory, SISOSprints, $filter) {

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

      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      $window.geofence.onTransitionReceived = function (geofences) {
        $log.log(geofences);


        if (geofences && ProfileFactory.getSISO() !== undefined) {

          $rootScope.$apply(function () {
            geofences.forEach(function (geo) {

              SISOSprints.get({
                fname: ProfileFactory.getProfile().fname,
                lname: ProfileFactory.getProfile().lname,
                mname: ProfileFactory.getProfile().mname,
              }, function (recs) {

                let record = {
                  "fname": ProfileFactory.getProfile().fname,
                  "mname": ProfileFactory.getProfile().lname,
                  "lname": ProfileFactory.getProfile().lname,
                  "mfname": ProfileFactory.getProfile().mfname,
                  "mlname": ProfileFactory.getProfile().mlname,
                  "contact": ProfileFactory.getProfile().contact,
                  "location": "",
                  "time": ""
                };

                if (geo.transitionType === 1) {

                  record.location = geo.notification.text;
                  record.time = $filter('date')(new Date(), 'h:mm a');

                  if (recs !== undefined && recs.length > 0) {
                    SISOSprints.delete({id: recs[0]._id}, function (success) {

                      SISOSprints.post(record, function (result) {
                        ProfileFactory.getSISO()._id = result._id;

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
                    }, function (error) {
                      geo.notification = geo.notification || {
                          title: error.status,
                          text: error.statusText
                        };
                      $ionicLoading.show({
                        template: error.status + ": " + error.statusText,
                        noBackdrop: true,
                        duration: 2000
                      });
                      $log.log({
                        title: 'Deleting record on DB when geo entering is detecting',
                        template: error.status + ', ' + error.statusText
                      });
                    });
                  } else {
                    SISOSprints.post(record, function (result) {
                      ProfileFactory.getSISO()._id = result._id;

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
                  }

                } else if (geo.transitionType === 2) {

                  if (recs !== undefined && recs.length > 0) {

                    SISOSprints.delete({id: recs[0]._id}, function (success) {

                      ProfileFactory.getSISO()._id = "";

                      geo.notification = geo.notification || {
                          title: "Geofence transition",
                          text: "Without notification"
                        };
                      $ionicLoading.show({
                        template: geo.notification.title + ": " + geo.notification.text,
                        noBackdrop: true,
                        duration: 2000
                      });

                    }, function (error) {
                      geo.notification = geo.notification || {
                          title: error.status,
                          text: error.statusText
                        };
                      $ionicLoading.show({
                        template: error.status + ": " + error.statusText,
                        noBackdrop: true,
                        duration: 2000
                      });
                      $log.log({
                        title: 'Deleting record on DB when geo entering is detecting',
                        template: error.status + ', ' + error.statusText
                      });
                    });

                  }
                }


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

        Geofence.getAll().then(function (geofences) {

          console.log(geofences);

          if (geofences.length === 0) {
            GeoLocations.get().forEach(function (geofence) {
              Geofence.addOrUpdate(geofence);
            });
          }
        }, function (reason) {
          $log.error("An Error has occured", reason);
        });


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
