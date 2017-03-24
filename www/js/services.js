angular.module('app.services', ['ngResource', 'ngStorage']).constant('ApiEndpoint', {
  url : 'https://lit-basin-60588.herokuapp.com/api/:path'
})

  .factory('Managers', [function () {
    var getManagers = function () {
      return [{'fname': 'Manager 1'}];
    };

    return {
      get: getManagers
    };
  }])
  .factory('Locations', [function () {
    var getLocations = function () {
      return ['Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5', 'Location 6'];
    };

    return {
      get: getLocations
    };
  }])

  .factory('Managers', [function () {
    var getLocations = function () {
      return ['Manager 6'];
    };

    return {
      get: getLocations
    };
  }])
  .factory('ProfileFactory', ['$localStorage', function ($localStorage) {

    $localStorage = $localStorage.$default({
      profileData: {},
      sisoData: {}
    });

    var saveSISO = function (user) {
      $localStorage.sisoData = user;
    };

    var getSISO = function () {
      return $localStorage.sisoData;
    };

    var isSISOEmptyObj = function () {
      return Object.keys($localStorage.sisoData).length === 0 && $localStorage.sisoData.constructor === Object;
    };


    var saveProfile = function (user) {
      $localStorage.profileData = user;
    };

    var getProfile = function () {
      return $localStorage.profileData;
    };

    var isProfileEmptyObj = function () {
      return typeof $localStorage.profileData === undefined || Object.keys($localStorage.profileData).length === 0 && $localStorage.profileData.constructor === Object;
    };

    var resetObj = function () {
      saveSISO({});
      saveProfile({});
    };

    return {
      setProfile: saveProfile,
      getProfile: getProfile,
      setSISO: saveSISO,
      getSISO: getSISO,
      reset: resetObj,
      isProfileEmpty: isProfileEmptyObj,
      isSISOEmpty: isSISOEmptyObj
    };

  }])

  .service('SISOService', ['$resource', 'ApiEndpoint', function ($resource, ApiEndpoint) {
    console.log('EndPoint:', ApiEndpoint.url);

    return $resource('', {}, {
      save: {method: 'POST', url: ApiEndpoint.url + '/siso', cache: false, responseType: 'json'},
      get: {
        method: 'GET',
        url: ApiEndpoint.url + '/siso/:pin/status/:status',
        params: {pin: '@pin', status: '@status'},
        cache: false,
        responseType: 'json'
      },
      update: {method: 'PUT', url: ApiEndpoint.url + '/siso/id/:id', params: {id: '@_id'}, responseType: 'json'},
      list: {method: 'GET', url: ApiEndpoint.url + '/siso/list/:pin', params: {pin: '@pin'}, responseType: 'json'},
      getUserByPIN: {
        method: 'GET',
        url: ApiEndpoint.url + '/siso/user/:pin',
        params: {pin: '@pin'},
        responseType: 'json'
      },
      getUserByUsername: {
        method: 'GET',
        url: ApiEndpoint.url + '/siso/user/username/:username/passw/:password',
        params: {
          username: '@username',
          passw: '@password'
        },
        responseType: 'json'
      },
      saveUser: {method: 'POST', url: ApiEndpoint.url + '/siso/user', cache: false, responseType: 'json'}
    });
  }])

  .service('SISOSprints', ['$resource', 'ApiEndpoint', function ($resource, ApiEndpoint) {
    return $resource('', {}, {
      get: {
        method: 'GET',
        url: ApiEndpoint.url,
        cache: false,
        params: {path: 'sisoweb', fname: '@fname', lname: '@lname'},
        responseType: 'json',
        isArray: true
      },
      post: {method: 'POST', url: ApiEndpoint.url, cache: false, params: {path: 'sisoweb'}, responseType: 'json'},
      delete: {
        method: 'DELETE',
        url: ApiEndpoint.url + '/:id',
        params: {path: 'sisoweb', id: '@_id'},
        cache: false,
        responseType: 'json'
      },
      getUserProfile: {
        method: 'GET',
        url: ApiEndpoint.url,
        params: {path: 'profiles', fname: '@fname', lname: '@lname'},
        isArray: true,
        cache: false,
        responseType: 'json'
      },
      getManagerList: {
        method: 'GET',
        url: ApiEndpoint.url + '?role=manager',
        params: {path: 'profiles'},
        isArray: true,
        cache: false,
        responseType: 'json'
      },
      getUsersByManager: {
        method: 'GET',
        url: ApiEndpoint.url,
        params: {path: 'profiles', mfname: '@fname', mlname: '@lname'},
        isArray: true,
        cache: false,
        responseType: 'json'
      },
      postProfile: {
        method: 'POST',
        url: ApiEndpoint.url,
        cache: false,
        params: {path: 'profiles'},
        responseType: 'json'
      },
      deleteProfile: {
        method: 'DELETE',
        url: ApiEndpoint.url + '/:id',
        params: {path: 'profiles', id: '@_id'},
        cache: false,
        responseType: 'json'
      },
      updateProfile: {
        method: 'PUT',
        url: ApiEndpoint.url + '/:id',
        params: {path: 'profiles', id: '@_id'},
        cache: false,
        responseType: 'json'
      }
    });
  }])

  .factory("Geofence", function ($rootScope,
                                 $window,
                                 $q,
                                 $log,
                                 $ionicLoading) {
    var geofenceService = {
      _geofences: [],
      _geofencesPromise: null,

      create: function (attributes) {
        var defaultGeofence = {
          id: UUIDjs.create().toString(),
          latitude: 50,
          longitude: 50,
          radius: 1000,
          transitionType: TransitionType.ENTER,
          notification: {
            id: this.getNextNotificationId(),
            title: "Ionic geofence example",
            text: "",
            icon: "res://ic_menu_mylocation",
            openAppOnClick: true
          }
        };

        return angular.extend(defaultGeofence, attributes);
      },

      loadFromLocalStorage: function () {
        var result = localStorage["geofences"];
        var geofences = [];

        if (result) {
          try {
            geofences = angular.fromJson(result);
          } catch (ex) {

          }
        }
        this._geofences = geofences;

        return $q.when(this._geofences);
      },

      saveToLocalStorage: function () {
        localStorage["geofences"] = angular.toJson(this._geofences);
      },

      loadFromDevice: function () {
        var self = this;

        if ($window.geofence && $window.geofence.getWatched) {
          return $window.geofence.getWatched().then(function (geofencesJson) {
            self._geofences = angular.fromJson(geofencesJson);
            return self._geofences;
          });
        }

        return this.loadFromLocalStorage();
      },

      getAll: function () {
        var self = this;

        if (!self._geofencesPromise) {
          self._geofencesPromise = $q.defer();
          self.loadFromDevice().then(function (geofences) {
            self._geofences = geofences;
            self._geofencesPromise.resolve(geofences);
          }, function (reason) {
            $log.error("Error fetching geofences", reason);
            self._geofencesPromise.reject(reason);
          });
        }

        return self._geofencesPromise.promise;
      },

      addOrUpdate: function (geofence) {
        var self = this;

        return $window.geofence.addOrUpdate(geofence).then(function () {
          var searched = self.findById(geofence.id);

          if (!searched) {
            self._geofences.push(geofence);
          } else {
            var index = self._geofences.indexOf(searched);

            self._geofences[index] = geofence;
          }

          self.saveToLocalStorage();
        });
      },

      findById: function (id) {
        var geoFences = this._geofences.filter(function (g) {
          return g.id === id;
        });

        if (geoFences.length > 0) {
          return geoFences[0];
        }

        return undefined;
      },

      remove: function (geofence) {
        var self = this;

        $ionicLoading.show({
          template: "Removing geofence..."
        });
        $window.geofence.remove(geofence.id).then(function () {
          $ionicLoading.hide();
          self._geofences.splice(self._geofences.indexOf(geofence), 1);
          self.saveToLocalStorage();
        }, function (reason) {
          $log.error("Error while removing geofence", reason);
          $ionicLoading.show({
            template: "Error while removing geofence",
            duration: 1500
          });
        });
      },

      removeAll: function () {
        var self = this;

        $ionicLoading.show({
          template: "Removing all geofences..."
        });
        $window.geofence.removeAll().then(function () {
          $ionicLoading.hide();
          self._geofences.length = 0;
          self.saveToLocalStorage();
        }, function (reason) {
          $log.error("Error while removing all geofences", reason);
          $ionicLoading.show({
            template: "Error",
            duration: 1500
          });
        });
      },

      getNextNotificationId: function () {
        var max = 0;

        this._geofences.forEach(function (gf) {
          if (gf.notification && gf.notification.id) {
            if (gf.notification.id > max) {
              max = gf.notification.id;
            }
          }
        });

        return max + 1;
      }
    };

    return geofenceService;
  })

  .factory("Geolocation", function ($q, $interval) {
    var currentPositionCache;

    return {
      getCurrentPosition: function () {
        if (!currentPositionCache) {
          var deffered = $q.defer();

          navigator.geolocation.getCurrentPosition(function (position) {
            deffered.resolve(currentPositionCache = position);
            $interval(function () {
              currentPositionCache = undefined;
            }, 10000, 1);
          }, function (error) {
            deffered.reject(error);
          }, {timeout: 10000, enableHighAccuracy: true});

          return deffered.promise;
        }

        return $q.when(currentPositionCache);
      }
    };
  })

  .factory("GeofencePluginMock", function ($q, $log) {
    return {
      addOrUpdate: function (fences) {
        var deffered = $q.defer();

        $log.log("Mocked geofence plugin addOrUpdate", fences);
        deffered.resolve();

        return deffered.promise;
      },
      remove: function (ids) {
        var deffered = $q.defer();

        $log.log("Mocked geofence plugin remove", ids);
        deffered.resolve();

        return deffered.promise;
      },
      removeAll: function () {
        var deffered = $q.defer();

        $log.log("Mocked geofence plugin removeAll");
        deffered.resolve();

        return deffered.promise;
      },
      initialize: function () {
      },
      receiveTransition: function () {
      },
      TransitionType: {
        ENTER: 1,
        EXIT: 2,
        BOTH: 3
      }
    };
  });
