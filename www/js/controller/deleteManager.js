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
      $scope.search = {"fname":"","lname":"","name":""};
      $scope.showSearch = false;
      $scope.showSearchButton = true;
      $scope.showMessage = !$scope.showSearch;

      $scope.startSearch = function() {
        $scope.showSearch = true;
        $scope.showSearchButton = false;
      }
      $scope.cancelSearch = function() {
        $scope.showSearch = false;
        $scope.showSearchButton = true;
      }
      $scope.message = function() {
        var msg = "";
        if($scope.managers.length == 0) {
//          if($scope.search.lname.length > 0 || $scope.search.fname.length > 0) {
          if($scope.search.name.length > 0) {
            msg = "No match.";
          }
        }
        return msg;
      }
      $scope.showAllManagers = function() {
        $scope.showAll = true;
        $scope.managers = $scope.allManagers;
        displaySearchResult();

      }
      $scope.numberOfManager = function() {
        return AllManagers.length;
      }
      $scope.searchChange = function() {
        $scope.managers = [];
        Object.keys($scope.allManagers).forEach(function (key) {
          var mgr = $scope.allManagers[key];
          var name = mgr.lname+", "+mgr.fname;
          var nmatch = $scope.search.name.length ==0 ||
            name.toLowerCase().indexOf($scope.search.name.toLowerCase()) >= 0;
//            mgr.lname.toLowerCase().indexOf($scope.search.name.toLowerCase()) >= 0 ||
//            mgr.fname.toLowerCase().indexOf($scope.search.name.toLowerCase()) >= 0;
/*
          var lmatch = $scope.search.lname.length ==0 ||
            mgr.lname.toLowerCase().indexOf($scope.search.lname.toLowerCase()) == 0;
          var fmatch = $scope.search.fname.length ==0 ||
            mgr.fname.toLowerCase().indexOf($scope.search.fname.toLowerCase()) == 0;
*/          var empty = isEmpty();
//          if(!empty && fmatch && lmatch) {
          if(!isEmpty() && nmatch) {
            $scope.managers.push($scope.allManagers[key]);
          }
        });
        if(isEmpty() && $scope.showAll) {
          $scope.managers = $scope.allManagers;
        }
        displaySearchResult();
      };

      function isEmpty() {
        return $scope.search.name.length ==0; // ($scope.search.lname.length ==0 && $scope.search.fname.length ==0);
      }
      function displaySearchResult() {
        if($scope.managers.length > 0) {
          $scope.showSearch = true;
        } else {
          if($scope.showAll && isEmpty()) {
            $scope.showSearch = true;
          } else {
            $scope.showSearch = false;
          }
        }
        $scope.showMessage = !$scope.showSearch;
      }

      $scope.delete = function() {
        var msg = "";
        var deleteManager = [];
console.log($scope.managers);
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
          console.log(confirmPopup);
          confirmPopup.then(function (res) {
            if(res) {
              $scope.search.fname = "";
              $scope.search.lname = "";
              $scope.search.name = "";
              $scope.showSearch = false;
              $scope.showSearchButton = true;
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
                console.log("newManagers: "+newManagers);
                $scope.allManagers = newManagers;
                displaySearchResult();
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
