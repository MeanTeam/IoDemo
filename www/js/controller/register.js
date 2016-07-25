angular.module('app.register', ['ionic-modal-select'])

  .controller('registerCtrl', ['$scope', '$interval', '$state',
    'SISOSprints', 'Locations', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaDialogs',
    'Managers', '$stateParams', '$ionicSideMenuDelegate',
    function ($scope, $interval, $state,
              SISOSprints, Locations, ProfileFactory, $ionicLoading, $ionicModal,
              $ionicPopup, $cordovaDialogs, Managers, $stateParams, $ionicSideMenuDelegate) {


      $scope.user = {fname: '', lname: ''};
      $scope.locations = Locations.get();
      $scope.dialog = {title: 'Login Page', buttonLabel: 'Login'};
      $scope.someModel = null;
      $scope.managers = [];
      $scope.title = "Register - SISO";
      $scope.fnameDisbl = false;
      $scope.mnameDisbl = false;
      $scope.lnameDisbl = false;
      $scope.registerBtnLabel = 'Register Profile';


      $scope.showCancelBtn = false;
      $scope.showToggleMenu = true;

      $scope.record = {
        "fname": "",
        "mname": "",
        "lname": "",
        "managerProfile": {},
        "mfname": "",
        "mlname": "",
        "contact": "",
        "location": "",
        "manager": ""
      };

      $scope.$on('$ionicView.beforeEnter', function () {

        //console.log('Is ProfileFactory.isEmpty() ', ProfileFactory.isEmpty(), ProfileFactory.get())

        if ($stateParams.mode === 'home' && !ProfileFactory.isEmpty()) {

          $state.go('tab.signInSignOut');
          return false;
        } else {

          if ($stateParams.mode === 'edit') {
            $scope.showCancelBtn = true;
            $scope.showToggleMenu = true;
            $scope.fnameDisbl = true;
            $scope.mnameDisbl = true;
            $scope.lnameDisbl = true;
            $scope.registerBtnLabel = 'Update Profile';
            $scope.title = "Edit Register - SISO"

          } else {
            $scope.showCancelBtn = false;
            $scope.showToggleMenu = false;
            $scope.fnameDisbl = false;
            $scope.mnameDisbl = false;
            $scope.lnameDisbl = false;
            $scope.registerBtnLabel = 'Register Profile';
          }

          SISOSprints.getManagerList({}, function (mgrs) {
            $scope.managers =mgrs;
          }, function(error) {
            $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
          });

          var profileData = ProfileFactory.get();

          Object.keys(profileData).forEach(function (key) {
            $scope.record[key] = profileData[key];
          });
        }

      });

      //$scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

      $scope.save = function () {
        var profileData = {};

        Object.keys($scope.record).forEach(function (key) {
          profileData[key] = $scope.record[key];

          if(key === 'mfname') {
            profileData[key] = $scope.record['managerProfile'].fname;
          } else
          if(key === 'mlname') {
           profileData[key] = $scope.record['managerProfile'].lname;
          }
        });

        ProfileFactory.set(profileData);
        $ionicLoading.show({template: 'Registered!', noBackdrop: true, duration: 2200});
        $state.go('tab.signInSignOut');
      };


      $scope.cancel = function () {
        $state.go('tab.signInSignOut');
      };


    }]);
