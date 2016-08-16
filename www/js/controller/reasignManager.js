angular.module('app.reassignManager', ['ionic-modal-select'])

  .controller('reassignManagerCtrl', ['$scope', '$state',
    'SISOSprints', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs',
    function ($scope, $state,
              SISOSprints, ProfileFactory, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs) {

      $scope.managerList = [];
      $scope.usersFromManager = [];
      $scope.record = {
        fromManager: {
          name: '',
          mfname: '',
          mlname: '',
          id: 0
        },
        toManager: {
          name: '',
          mfname: '',
          mlname: '',
          id: 0
        }
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        SISOSprints.getManagerList({}, function (mgrs) {
          $scope.managerList = mgrs;
        }, function (error) {
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      });

      $scope.optionManager = function (opt) {
        return {
          name: opt.fname + ' ' + opt.lname,
          mfname: opt.fname,
          mlname: opt.lname,
          id: opt._id
        };
      };

      $scope.onSelect = function (newV, OldV) {
        SISOSprints.getUsersByManager({
          'mfname': $scope.record.fromManager.mfname,
          'mlname': $scope.record.fromManager.mlname
        }, function (users) {

          $scope.usersFromManager = users;
          $scope.usersFromManager.forEach(function (e) {
            e.selected = false;
          });
        }, function (error) {
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      };

      $scope.display = function () {
        var allSelected = $scope.usersFromManager.filter(function (v) {
          return v.selected === true;
        }).map(function (e) {
          return e._id;
        });
        console.log('Actual: ', allSelected);
      };

      $scope.reassignManager = function () {

        var allSelected = $scope.usersFromManager.filter(function (v) {
          return v.selected === true;
        }).map(function (e) {
          return e._id;
        });

        SISOSprints.postProfile({
          'transaction-type': 'reassign-manager',
          'fromManagerId': $scope.record.fromManager.id,
          'toManagerId': $scope.record.toManager.id,
          'userIds': allSelected
        }, function (result) {
          console.log(result.message);
          $ionicLoading.show({template: 'Profiles updated.', noBackdrop: true, duration: 2200});
        }, function (error) {
          console.log(error);
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      };

    }]);
