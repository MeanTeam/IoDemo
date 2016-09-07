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
      $scope.search = {"name":""};
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
        $scope.managers = [];
        Object.keys($scope.allManagers).forEach(function (key) {
          var mgr = $scope.allManagers[key];
          mgr = markFound(mgr, "");
          $scope.managers.push(mgr);
        });
        displaySearchResult();

      }
      $scope.numberOfManager = function() {
        return AllManagers.length;
      }
      $scope.searchChange = function() {
        $scope.managers = [];
        Object.keys($scope.allManagers).forEach(function (key) {
          var mgr = $scope.allManagers[key];
          var name = mgr.fname+" "+mgr.lname;
          var nmatch = $scope.search.name.length ==0 ||
            name.toLowerCase().indexOf($scope.search.name.toLowerCase()) >= 0;
          var empty = isEmpty();
          if(!isEmpty() && nmatch) {
            var mgr = $scope.allManagers[key];
            mgr = markFound(mgr, $scope.search.name);
            $scope.managers.push(mgr);
          }
        });
        if(isEmpty() && $scope.showAll) {
          Object.keys($scope.allManagers).forEach(function (key) {
            var mgr = $scope.allManagers[key];
            mgr = markFound(mgr, "");
            $scope.managers.push(mgr);
          });
        }
        displaySearchResult();
      };

      function isEmpty() {
        return $scope.search.name.length ==0;
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
        Object.keys($scope.managers).forEach(function (key) {
          var mgr = $scope.managers[key];
          if(mgr.delete){
            msg += mgr.fname+' '+mgr.lname+'<br/>';
            deleteManager.push(mgr);
          }
        });
        if(!msg) {
          if($scope.managers.length > 0) {
            $ionicLoading.show({template: 'Please select manager(s) to delete.', noBackdrop: true, duration: 2200});
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
              $scope.search.name = "";
              $scope.showSearch = false;
              $scope.showMessage = true;
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
                $ionicLoading.show({template: 'Manager(s) Deleted Successfully.', noBackdrop: true, duration: 2200});

//                displaySearchResult();
              }, function(error) {
                $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
              });
            }); // end forEach
          }
          });
        }
      };

      function markFound(mgr, found) {
        var fullname = mgr.fname+' '+mgr.lname;
        mgr["name"] = {"first":mgr.fname,"found":" ","second":mgr.lname};
        if(found != undefined && found.trim().length > 0) {
          var i = fullname.toLowerCase().indexOf(found);
          if(i > -1) {
            var f = fullname.substring(0,i);
            var m = fullname.substring(i, i+found.length);
            var l = fullname.substring(i+found.length, fullname.length);
            mgr["name"] = {"first":f,"found":m,"second":l};
          }
        }
        return mgr;
      }
      $scope.$on('$ionicView.beforeEnter', function () {
        SISOSprints.getManagerList({}, function (mgrs) {
          Object.keys(mgrs).forEach(function(key) {
            var mgr = mgrs[key];
            if(mgr != undefined && mgr._id != undefined) {
              SISOSprints.getUsersByManager({mfname: mgr.fname, mlname: mgr.lname}, function (success) {
                if(success.length === 0) {
                  mgr.delete = false;
                  mgr = markFound(mgr,"");
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
