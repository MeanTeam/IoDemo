angular.module('app.reassignManager', ['ionic-modal-select'])

  .controller('reassignManagerCtrl', ['$scope', '$state',
    'SISOSprints', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs',
    function ($scope, $state,
              SISOSprints, ProfileFactory, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs) {

      $scope.managerList = [];
      $scope.record = {
        'fromManager': '',
        'toManager': ''
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        SISOSprints.getManagerList({}, function (mgrs) {
          $scope.managerList = mgrs;
        }, function (error) {
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      });

      $scope.optionManager = function (opt) {
        return opt.fname + ' ' + opt.lname;
      };

      $scope.reassignManager = function () {
        // Get all user under manager (FROM)

        var fromManagerName = $scope.record.fromManager.split(' ');
        //console.log(fromManagerName);

        SISOSprints.getUsersByManager({'mfname': fromManagerName[0], 'mlname': fromManagerName[1]}, function (users) {
          //console.log(users);
          if (typeof users !== undefined && users.length > 0) {
            var toManagerName = $scope.record.toManager.split(' ');

            users.forEach(function (e) {
              e.mfname = toManagerName[0];
              e.mlname = toManagerName[1];

              SISOSprints.updateProfile(e, function (result) {
                $ionicLoading.show({template: 'Profile updated.', noBackdrop: true, duration: 2200});
              });
            });
          }
        }, function (error) {
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      };


    }]);
