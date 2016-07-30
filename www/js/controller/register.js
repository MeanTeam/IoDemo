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
        "preferredLocation": "",
        "manager": ""
      };




      $scope.$on('$ionicView.beforeEnter', function () {


        if ($stateParams.mode === 'home' && !ProfileFactory.isProfileEmpty()) {
          $state.go('tab.signInSignOut');
          return false;
        }
        else if ($stateParams.mode === 'edit') {
            $scope.showCancelBtn = true;
            $scope.showToggleMenu = true;
            $scope.title = "Edit Register - SISO"
          SISOSprints.getManagerList({}, function (mgrs) {
            $scope.managers =mgrs;
          }, function(error) {
            $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
          });

          var profileData = ProfileFactory.getProfile();

          Object.keys(profileData).forEach(function (key) {
            $scope.record[key] = profileData[key];
          });
        }
        else if(ProfileFactory.isProfileEmpty()) {
          $scope.showCancelBtn = false;
          $scope.showToggleMenu = false;
          $ionicModal.fromTemplateUrl('templates/userDialog.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
          }).then(function(modal){
            $scope.userDialog = modal;
            $scope.userDialog.show();
          });

         }

      });

      $scope.searchUser = function(u) {
        var profileData = {};
        if(u.fname !== '' && u.lname !== ''){
          SISOSprints.getUserProfile(u, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
                $scope.record = recs[0];
                Object.keys($scope.record).forEach(function (key) {
                 profileData[key] = $scope.record[key];
                // ProfileFactory.setProfile(profileData); 
                // $scope.userDialog.hide();               
                // $state.go('tab.signInSignOut');
               });
              ProfileFactory.setProfile(profileData); 
              $scope.userDialog.hide();               
              $state.go('tab.signInSignOut');
            }else{
              $scope.userDialog.hide();
            }
          });
        }else{
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }
      };


      //$scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

      $scope.save = function () {
        var profileData = {};
        $scope.record.role='user';
        Object.keys($scope.record).forEach(function (key) {
          profileData[key] = $scope.record[key];

          if(key === 'mfname') {
            profileData[key] = $scope.record['managerProfile'].fname;
          } else
          if(key === 'mlname') {
           profileData[key] = $scope.record['managerProfile'].lname;
          }
        });

        SISOSprints.postProfile($scope.record, function (result) {          
          if (typeof result !== undefined && typeof result._id !== undefined) {
               ProfileFactory.getProfile()._id = result._id;
              ProfileFactory.setProfile(profileData);

              //$ionicLoading.show({template: 'Sign In successful!', noBackdrop: true, duration: 2200});
              //alert('Registration successful!');
              $ionicLoading.show({template: 'Registered!', noBackdrop: true, duration: 2200});
              $state.go('tab.signInSignOut');

          } else {
              $ionicLoading.show({template: 'Registration In result error.', noBackdrop: true, duration: 2200});
            }
        }, function (error) {
          alert(error.status + ', ' + error.statusText);
        }); //End postProfile service call

      }; // End save function


      $scope.cancel = function () {
        $state.go('tab.signInSignOut');
      };


    }]);
