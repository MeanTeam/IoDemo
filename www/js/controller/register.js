angular.module('app.register', ['ionic-modal-select'])

  .controller('registerCtrl', ['$scope', '$interval', '$state',
    'SISOSprints', 'Locations', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', 
    'Managers', '$stateParams', '$ionicSideMenuDelegate',
    function ($scope, $interval, $state,
              SISOSprints, Locations, ProfileFactory, $ionicLoading, $ionicModal,
              $ionicPopup, Managers, $stateParams, $ionicSideMenuDelegate) {


      $scope.user = {fname: '', lname: ''};
      $scope.locations = Locations.get();

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
        'managerProfile': '',
        "mfname": "",
        "mlname": "",
        "contact": "",
        "preferredLocation": "",
        "._id": ""
      };

      $scope.optionManager = function (opt) {
        return opt.fname + ' ' + opt.lname;
      };


      $scope.$on('$ionicView.beforeEnter', function () {

        if (ProfileFactory.isProfileEmpty()) {
           $scope.showCancelBtn = false;
           $scope.showToggleMenu = false;
        }
        else if ($stateParams.mode === 'edit') {
          $ionicLoading.show({
            template: 'Loading Profile ...'
          });
          $scope.fnameDisbl = true;
          $scope.mnameDisbl = true;
          $scope.lnameDisbl = true;
          $scope.registerBtnLabel = 'Update Profile';
          $scope.title = "Edit Register - SISO" ;
          var profileData = ProfileFactory.getProfile();
            Object.keys(profileData).forEach(function (key) {
              $scope.record[key] = profileData[key];
            });
          $scope.record.managerProfile = $scope.record.mfname + ' ' +  $scope.record.mlname;
          $ionicLoading.hide();
        }

        SISOSprints.getManagerList({}, function (mgrs) {
            $scope.managers =mgrs;
          }, function(error) {
             $ionicPopup.alert({title: 'Error', template: 'Fail on Server connection' });
          });


      });// End beforeEnter function event



      $scope.save = function () {
        var profileData = ProfileFactory.getProfile();
        var managerName = $scope.record.managerProfile.split(' ');
        $scope.record.mfname = managerName[0];
        $scope.record.mlname = managerName[1];;

        if(ProfileFactory.isProfileEmpty()) {
              profileData = {};
              $scope.record.role='user';
              SISOSprints.postProfile($scope.record, function (result) {
              if (typeof result !== undefined && typeof result._id !== undefined) {
                    Object.keys(result).forEach(function (key) {
                        profileData[key] = result[key];
                    });
                  ProfileFactory.setProfile(profileData);
                  $ionicPopup.alert({title: 'Register', template: 'Successfully Registered!' })
                    .then(function(res) {
                         $state.go('tab.signInSignOut');
                    });
              } else {
                  $ionicPopup.alert({title: 'Error', template: 'Registration In result error' });
                }
            }, function (error) {
              $ionicPopup.alert({title: 'Error', template: error.status + ', ' + error.statusText });
            }); //End postProfile service call
        } // End ProfileFactory empty check
        else if ($stateParams.mode === 'edit' && !ProfileFactory.isProfileEmpty()) {
            $scope.record._id = ProfileFactory.getProfile()._id;
            SISOSprints.updateProfile($scope.record, function (result) {
                if (typeof result !== undefined && typeof result._id !== undefined) {
                        Object.keys(result).forEach(function (key) {
                            profileData[key] = result[key];
                        });
                      ProfileFactory.setProfile(profileData);
                      $ionicPopup.alert({title: 'Edit Profile', template: 'Successfully Updated Profile!' })
                              .then(function(res) {
                                    $state.go('tab.signInSignOut');
                                });

                  }
                  else
                  {
                      $ionicPopup.alert({title: 'Error', template: 'Update Registration In result error.' });
                  }
                }, function (error) {
                  $ionicPopup.alert({title: 'Error', template: error.status + ', ' + error.statusText });
            }); //End updateProfile service call
        }// End ProfileFactory NOT empty check
      }; // End save function


      $scope.cancel = function () {
        $state.go('tab.signInSignOut');
      };


    }]);

