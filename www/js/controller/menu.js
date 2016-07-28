angular.module('app.menu', ['ionic-modal-select'])

.controller('menuCtrl', ['$scope', 'ProfileFactory', '$location', '$ionicPopup', '$ionicSideMenuDelegate',
  function ($scope, ProfileFactory, $location, $ionicPopup, $ionicSideMenuDelegate) {

   $scope.displayListSignins = false;
    $scope.isAdmin = false;


   $scope.$on('$ionicView.beforeEnter', function () {
        $scope.displayListSignins = false;
         $scope.isAdmin = false;
        if(!ProfileFactory.isEmpty()) {
          if(ProfileFactory.get().manager){
            $scope.displayListSignins = true;
          }
          //call SISO Service
           // SISOSprints.get({fname: ProfileFactory.get().fname, lname: ProfileFactory.get().lname, mname: ProfileFactory.get().mname,}, function (recs) {
           // $scope.isAdmin = true;
        }

   });

    $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };


    $scope.reset = function(){
      $location.path('/tab/register');

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
