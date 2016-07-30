angular.module('app.menu', ['ionic-modal-select'])

.controller('menuCtrl', ['$scope', 'ProfileFactory', '$location', '$ionicPopup', '$ionicSideMenuDelegate','SISOSprints','$cordovaDialogs',
  function ($scope, ProfileFactory, $location, $ionicPopup, $ionicSideMenuDelegate, SISOSprints, $cordovaDialogs) {

   $scope.displayListSignins = false;
    $scope.isAdmin = false;


   $scope.$on('$ionicView.beforeEnter', function () {
        $scope.displayListSignins = false;
         $scope.isAdmin = false;
        if(!ProfileFactory.isProfileEmpty()) {
          SISOSprints.getUserProfile({
            fname: ProfileFactory.getProfile().fname,
            lname: ProfileFactory.getProfile().lname,
          }, function (userProfileArray) {
            Object.keys(userProfileArray).forEach(function (key) {
              var userProfile = userProfileArray[key];
              if(userProfile.role === 'administrator') {
                $scope.isAdmin = true;
              };
              if(userProfile.role === 'manager') {
                $scope.displayListSignins = true;
              };
            });

          }, function(error) {
            $cordovaDialogs.alert('Fail on Server connection', 'Error', 'OK');
          });

        }

   });

    $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };


    $scope.reset = function(){
      

      var confirmPopup = $ionicPopup.confirm({
        title: '<b>Confirm Reset</b>',
        template: 'Are you sure want to reset your profile data.'
      });

      confirmPopup.then(function (res) {
        if(res){
          ProfileFactory.reset();
          $location.path('/tab/register');
        }

      });
    }
  }]);
