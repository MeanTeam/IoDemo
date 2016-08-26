angular.module('app.login', ['ionic-modal-select'])

.controller('loginCtrl', ['$scope', '$interval', '$state', 'SISOSprints',
      'ProfileFactory', '$ionicLoading', '$cordovaDialogs',
      function ($scope, $interval, $state,
              SISOSprints, ProfileFactory, $ionicLoading, $cordovaDialogs ) {

    // $scope.user = {username: "", password: ""};

    // $scope.goNext = function (path) {

    //   SISOService.getUserByUsername({username: $scope.user.username, password: $scope.user.password},
    //     function (userRec) {
    //       //console.log(userRec);
    //       if (userRec.success) {
    //         SISOFactory.set(userRec.record);
    //         $location.path(path);
    //       }else{
    //         //console.log(userRec);
    //         //
    //       }
    //     });
    // };

    // $scope.goToRegisterPage = function(){
    //     $location.path('/tab/register');
    // }


    $scope.user = {fname: '', lname: ''};
    $scope.title = "Login - SISO";


    $scope.$on('$ionicView.beforeEnter', function () {
      if (!ProfileFactory.isProfileEmpty()) {
        $state.go('tab.signInSignOut');
        return false;
      }
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
              $state.go('tab.signInSignOut');
            } else {
             $state.go('tab.register');
            }
          }, function (error) {
            console.log(error);
            $ionicLoading.show({template: error.status + ', ' + error.statusText, noBackdrop: true, duration: 2200});
            alert(error.status + ', ' + error.statusText);
          });
        } else {
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }
    };

    
  }])
