angular.module('app.createManager', ['ionic-modal-select'])

.controller('createManagerCtrl', ['$scope', '$interval', '$state',
    'SISOSprints', 'Locations', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs',
    'Managers', '$stateParams', '$ionicSideMenuDelegate',
    function ($scope, $interval, $state,
              SISOSprints, Locations, ProfileFactory, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs, Managers, $stateParams, $ionicSideMenuDelegate) {

      $scope.user = {fname: '', lname: ''};
      $scope.locations = Locations.get();

      $scope.someModel = null;
      $scope.managers = [];
      $scope.title = "Create Manager - SISO";

      $scope.showCancelBtn = false;
      $scope.showToggleMenu = true;

      $scope.record = {
        "fname": "",
        "lname": "",
        "role": "",
        "managerProfile": {},
        "mfname": "",
        "mlname": "",
        "contact": "",
        "email": "",
        "manager": "",
      };



      $scope.$on('$ionicView.beforeEnter', function () {   
        SISOSprints.getManagerList({}, function (mgrs) {
            $scope.managers =mgrs;
          }, function(error) {
            $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
          });

      });

	// $scope.getOption = function(option){
    // return option.fname + ":" + option.lname;
	// };


      $scope.create = function () {
        $scope.record.role='manager';
        $scope.record.mfname = $scope.record.managerProfile.fname;
        $scope.record.mlname = $scope.record.managerProfile.lname;
        
        SISOSprints.postProfile($scope.record, function (result) {          
              if (typeof result !== undefined && typeof result._id !== undefined) {
                 //alert('Manager was created.');
                 $ionicPopup.alert({title: '<b>Create Manager</b>', template: 'Manager was created.'});
                 $state.go('tab.signInSignOut');
              } else {
                //alert('Create Manager In result error');
                $ionicPopup.alert({title: '<b>Create Manager</b>', template: 'Create Manager In result error.'});
                }
            }, function (error) {
              $ionicLoading.show({template: error.status + ', ' + error.statusText, noBackdrop: true, duration: 2200});
              alert(error.status + ', ' + error.statusText);
            }); //End postProfile service call

      }; // End save function

      $scope.cancel = function () {
        $state.go('tab.signInSignOut');
      };
}]);