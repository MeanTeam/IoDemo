angular.module('app.menu', ['ionic-modal-select'])
.controller('menuCtrl', ['$scope', 'ProfileFactory', '$location', '$ionicPopup',
  function ($scope, ProfileFactory, $location, $ionicPopup) {

   $scope.displayListSignins = false;


   $scope.$on('$ionicView.beforeEnter', function () {

        if(!ProfileFactory.isEmpty()) {
          console.log("ProfileFactory.get().manager " + ProfileFactory.get().manager);
          if(ProfileFactory.get().manager){
            $scope.displayListSignins = true;
          }
        }
        
   });


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
