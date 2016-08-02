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
        "role": "",
        "managerProfile": {},
        "mfname": "",
        "mlname": "",
        "contact": "",
        "preferredLocation": "",
        "manager": "",
        "._id": ""
      };


      // $scope.selected = function() {
      //   console.log("selected");
      //    return   $scope.record.managerProfile.fname 
      //               + " " + $scope.record.managerProfile.lname;


      // }

      $scope.$on('$ionicView.beforeEnter', function () {
        if ($stateParams.mode === 'home' && !ProfileFactory.isProfileEmpty()) {
          $state.go('tab.signInSignOut');
          return false;
        } 
        else if ($stateParams.mode === 'edit') {
          $scope.fnameDisbl = true;
          $scope.mnameDisbl = true;
          $scope.lnameDisbl = true;
          $scope.registerBtnLabel = 'Update Profile';
          $scope.title = "Edit Register - SISO"
        }
        else if (ProfileFactory.isProfileEmpty()) {
          $scope.showCancelBtn = false;
          $scope.showToggleMenu = false;
          $ionicModal.fromTemplateUrl('templates/userDialog.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
          }).then(function (modal) {
            $scope.userDialog = modal;
            $scope.userDialog.show();
          });
        }

        SISOSprints.getManagerList({}, function (mgrs) {
            $scope.managers =mgrs;
          }, function(error) {
            $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
          });

         var profileData = ProfileFactory.getProfile();
          Object.keys(profileData).forEach(function (key) {
            if(key === 'mfname') {
              $scope.record['managerProfile'].fname =profileData[key];
            } 
            else if(key === 'mlname') {
               $scope.record['managerProfile'].lname = profileData[key];
            }
            $scope.record[key] = profileData[key];
          });

                    //   $scope.record.managerProfile.name = $scope.record.managerProfile.fname 
                    // + " " + $scope.record.managerProfile.lname;
                    // $scope.record.managerProfile = $scope.record.managerProfile.name
                    // console.log($scope.record.managerProfile.name);



      });// End beforeEnter function event

      $scope.searchUser = function (u) {
        var profileData = {};
        if (u.fname !== '' && u.lname !== '') {
          SISOSprints.getUserProfile(u, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
                $scope.record = recs[0];
                Object.keys($scope.record).forEach(function (key) {
                 profileData[key] = $scope.record[key];
               });

              ProfileFactory.setProfile(profileData); 
              $scope.userDialog.hide();               
              $state.go('tab.signInSignOut');
            } else {
              $scope.userDialog.hide();
            }
          });
        } else {
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }
      };



      $scope.save = function () {
        var profileData = ProfileFactory.getProfile();
        $scope.record.role='user';
        $scope.record.mfname = $scope.record.managerProfile.fname;
        $scope.record.mlname = $scope.record.managerProfile.lname;
        $scope.record._id = ProfileFactory.getProfile()._id;
        
        if(ProfileFactory.isProfileEmpty()) {
              SISOSprints.postProfile($scope.record, function (result) {          
              if (typeof result !== undefined && typeof result._id !== undefined) {
                    Object.keys(result).forEach(function (key) {
                        profileData[key] = result[key];
                    });
                  ProfileFactory.setProfile(profileData);
                  $ionicLoading.show({template: 'Registered!', noBackdrop: true, duration: 2200});
                  $state.go('tab.signInSignOut');

              } else {
                  $ionicLoading.show({template: 'Registration In result error.', noBackdrop: true, duration: 2200});
                }
            }, function (error) {
              $ionicLoading.show({template: error.status + ', ' + error.statusText, noBackdrop: true, duration: 2200});
              alert(error.status + ', ' + error.statusText);
            }); //End postProfile service call
        } // End ProfileFactory empty check
        else if ($stateParams.mode === 'edit' && !ProfileFactory.isProfileEmpty()) {
          console.log("edit user profile " + $scope.record);      
            SISOSprints.updateProfile($scope.record, function (result) {
                if (typeof result !== undefined && typeof result._id !== undefined) {
                        Object.keys(result).forEach(function (key) {
                            profileData[key] = result[key];
                            console.log("profileData[key]" + profileData[key]);
                        });
                      ProfileFactory.setProfile(profileData);
                      $ionicLoading.show({template: 'Successfully Updated Profile!', noBackdrop: true, duration: 2200});
                      $state.go('tab.signInSignOut');

                  } 
                  else 
                  {
                      $ionicLoading.show({template: 'Update Registration In result error.', noBackdrop: true, duration: 2200});
                  }
                }, function (error) {
                  $ionicLoading.show({template: error.status + ', ' + error.statusText, noBackdrop: true, duration: 2200});
                  alert(error.status + ', ' + error.statusText); 
            }); //End updateProfile service call
        }// End ProfileFactory NOT empty check
      }; // End save function


      $scope.cancel = function () {
        $state.go('tab.signInSignOut');
      };


    }]);

