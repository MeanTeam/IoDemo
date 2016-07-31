angular.module('app.deleteManager', ['ionic-modal-select'])

  .controller('deleteManagerCtrl', ['$scope',
    'SISOSprints', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs',
    '$stateParams', '$ionicSideMenuDelegate',
    function ($scope,
              SISOSprints, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs, $stateParams, $ionicSideMenuDelegate) {

      $scope.managers = [];
      $scope.message = "";

      $scope.delete = function() {
        var msg = "";
        var deleteManager = [];

        Object.keys($scope.managers).forEach(function (key) {
          var mgr = $scope.managers[key];
          if(mgr.delete){
            msg += mgr.lname+','+mgr.fname+'<br/>';
            deleteManager.push(mgr);
          }
        });
        if(!msg) {
          if($scope.managers.length > 0) {
            $ionicLoading.show({template: 'Please select managers to delete.', noBackdrop: true, duration: 2200});
          }
        } else {
          var confirmPopup = $ionicPopup.confirm({
            title: '<b>Delete Manager</b>',
            template: msg
          });
          confirmPopup.then(function (res) {
            if(res) {
            Object.keys(deleteManager).forEach(function(key) {
              var mgr = deleteManager[key];
              SISOSprints.deleteProfile({id: mgr._id}, function (success) {
                var newManagers = [];
                Object.keys($scope.managers).forEach(function (key) {
                  var _mgr = $scope.managers[key];
                  if(_mgr._id != undefined && mgr._id != _mgr._id){
                    newManagers.push(_mgr);
                  }
                });
                $scope.managers = newManagers;
                if($scope.managers.length === 0) {
                  $scope.message = "No manager to delete.";
                }
              }, function(error) {
                $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
              });
            }); // end forEach
          }
          });
        }
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        SISOSprints.getManagerList({}, function (mgrs) {
          Object.keys(mgrs).forEach(function(key) {
            var mgr = mgrs[key];
            if(mgr != undefined && mgr._id != undefined) {
              SISOSprints.getUsersByManager({mfname: mgr.fname, mlname: mgr.lname}, function (success) {
                if(success.length === 0) {
                  mgr.delete = false;
                  $scope.managers.push(mgr);
                }
              }, function (error) {
                console.error(error.status + ', ' + error.statusText);
                // keep on next
              });
            }
          });
        }, function(error) {
          $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
        });

      });


    }]);
