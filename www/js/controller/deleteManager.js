angular.module('app.deleteManager', ['ionic-modal-select'])

  .controller('deleteManagerCtrl', ['$scope',
    'SISOSprints', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs',
    '$stateParams', '$ionicSideMenuDelegate',
    function ($scope,
              SISOSprints, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs, $stateParams, $ionicSideMenuDelegate) {

      $scope.managers = [];
      $scope.allManagers = []
      $scope.message = "";
      $scope.fname = "";
      $scope.lname = "";
      $scope.search = {"fname":"","lname":""};

      $scope.searchChange = function() {
        $scope.managers = [];
        Object.keys($scope.allManagers).forEach(function (key) {
          var mgr = $scope.allManagers[key];
          var lmatch = $scope.search.lname.length ==0 ||
            mgr.lname.toLowerCase().indexOf($scope.search.lname.toLowerCase()) == 0;
          var fmatch = $scope.search.fname.length ==0 ||
            mgr.fname.toLowerCase().indexOf($scope.search.fname.toLowerCase()) == 0;
          if(fmatch && lmatch) {
            $scope.managers.push($scope.allManagers[key]);
          }
        });
      };
/*      $scope.fChange = function(n) {
        var _n = n.toLowerCase();
        $scope.managers = [];
        Object.keys($scope.allManagers).forEach(function (key) {
          var mfname = $scope.allManagers[key].fname.toLowerCase();
          var mlname = $scope.allManagers[key].lname.toLowerCase();
          if($scope.lname.length === 0) {
            if(_n.length === 0 || mfname.indexOf(_n) === 0){
              $scope.managers.push($scope.allManagers[key]);
            }
          } else {
            if(mlname.indexOf($scope.lname.toLowerCase()) === 0 &&
              (_n.length === 0 || mfname.indexOf(_n) === 0)){
              $scope.managers.push($scope.allManagers[key]);
            }

          }
        });
      }

      $scope.lChange = function(n) {
        console.log(n+","+$scope.lname);
        $scope.lname = n;
        var _n = n.toLowerCase();
        $scope.managers = [];
        Object.keys($scope.allManagers).forEach(function (key) {
          var mfname = $scope.allManagers[key].fname.toLowerCase();
          var mlname = $scope.allManagers[key].lname.toLowerCase();
          if($scope.fname.length === 0) {
            if(_n.length === 0 || mlname.indexOf(_n) === 0){
              $scope.managers.push($scope.allManagers[key]);
            }
          } else {
            if(mfname.indexOf($scope.fname.toLowerCase()) === 0 &&
              (_n.length === 0 || mlname.indexOf(_n) === 0)){
              $scope.managers.push($scope.allManagers[key]);
            }

          }
        });
      }

*/
      $scope.delete = function() {
        var msg = "";
        var deleteManager = [];

        Object.keys($scope.managers).forEach(function (key) {
          var mgr = $scope.managers[key];
          console.log(mgr);
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
              $scope.search.fname = "";
              $scope.search.lname = "";
            Object.keys(deleteManager).forEach(function(key) {
              var mgr = deleteManager[key];
              SISOSprints.deleteProfile({id: mgr._id}, function (success) {
                var newManagers = [];
                Object.keys($scope.allManagers).forEach(function (key) {
                  var _mgr = $scope.allManagers[key];
                  if(_mgr._id != undefined && mgr._id != _mgr._id){
                    newManagers.push(_mgr);
                  }
                });
                $scope.managers = newManagers;
                $scope.allManagers = newManagers;
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
                  $scope.allManagers.push(mgr);
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
