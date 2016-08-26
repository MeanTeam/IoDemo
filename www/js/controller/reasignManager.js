angular.module('app.reassignManager', ['ionic-modal-select', 'LiveSearch'])

  .controller('reassignManagerCtrl', ['$scope', '$state',
    'SISOSprints', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs', '$q',
    function ($scope, $state,
              SISOSprints, ProfileFactory, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs, $q) {

      $scope.managerList = [];
      $scope.usersFromManager = [];
      $scope.record = {
        fromManager: '',
        toManager: '',
        fromManagerId: '',
        toManagerId: ''
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        $ionicLoading.show({
          template: 'Loading Managers...'
        });

        SISOSprints.getManagerList({}, function (mgrs) {
          $scope.managerList = mgrs;
          $ionicLoading.hide();
        }, function (error) {
          $ionicLoading.hide();
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      });

      $scope.getUsersFromManager = function (manager) {
        var fromManager = manager.split(' ');

        SISOSprints.getUsersByManager({
          'mfname': fromManager[0],
          'mlname': fromManager[1]
        }, function (users) {
          $ionicLoading.show({
            template: 'Loading Users...'
          });

          $scope.usersFromManager = users;
          $scope.usersFromManager.forEach(function (e) {
            e.selected = false;
          });
          $ionicLoading.hide();
        }, function (error) {
          $ionicLoading.hide();
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      };

      $scope.undoForm = function () {
        $scope.record = {
          fromManager: '',
          toManager: '',
          fromManagerId: '',
          toManagerId: ''
        };
        $scope.usersFromManager = [];
      };

      $scope.fromManagerSearch = function (param) {
        $scope.record.fromManagerId = '';
        
        return managerSearch.call(null, param, $scope.record.toManagerId);
      };

      $scope.toManagerSearch = function (param) {
        $scope.record.toManagerId = '';
        return managerSearch.call(null, param, $scope.record.fromManagerId);
      };

      function managerSearch(param, ignoreId) {

        var defer = $q.defer();
        var managerResultList = $scope.managerList.filter(function (el) {

          var isSelected = ignoreId === el._id;

          var completeName = el.fname.trim().toLowerCase() + ' ' + el.lname.trim().toLowerCase();

          return (el.fname.trim().toLowerCase().indexOf(param.trim().toLowerCase()) >= 0 ||
            el.lname.trim().toLowerCase().indexOf(param.trim().toLowerCase()) >= 0 ||
            completeName.indexOf(param.trim().toLowerCase()) >= 0) && !isSelected;
        });

        defer.resolve(managerResultList);

        return defer.promise;
      };

      $scope.fromManagerSelected = function (result) {
        $scope.record.fromManagerId = result.item._id;
        var managerName = result.item.fname + ' ' + result.item.lname;
        $scope.getUsersFromManager.call(null, managerName);
        return managerName;
      };

      $scope.toManagerSelected = function (result) {
        $scope.record.toManagerId = result.item._id;
        return result.item.fname + ' ' + result.item.lname;
      };

      $scope.selectAll = function (status) {
        $scope.usersFromManager.forEach(function(el){
          el.selected = status;
        });
      };

      $scope.reassignManager = function () {

        $ionicLoading.show({
          template: 'Loading Users...'
        });

        var allSelected = $scope.usersFromManager.filter(function (v) {
          return v.selected === true;
        }).map(function (e) {
          return e._id;
        });

        if (allSelected.length === 0) {
          $ionicLoading.hide();
          $cordovaDialogs.alert('Select the Users to Re-assign', 'Error', 'OK');
          return false;
        }


        SISOSprints.postProfile({
          'transaction-type': 'reassign-manager',
          parameters: {
            'fromManagerId': $scope.record.fromManagerId,
            'toManagerId': $scope.record.toManagerId,
            'userIds': allSelected
          }
        }, function (result) {

          if (result.message === 'success') {
            var fromManager = $scope.record.fromManager.split(' ');
            SISOSprints.getUsersByManager({
              'mfname': fromManager[0],
              'mlname': fromManager[1]
            }, function (users) {

              $scope.usersFromManager = users;
              $scope.usersFromManager.forEach(function (e) {
                e.selected = false;
              });
            }, function (error) {
              $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
            });
          }

          $ionicLoading.hide();
          $ionicLoading.show({template: 'Manager Re-assigned.', noBackdrop: true, duration: 2200});

        }, function (error) {
          $ionicLoading.hide();
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });
      };

    }]);
