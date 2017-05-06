angular.module('app.login', ['ionic-modal-select'])

  .controller('loginCtrl', ['$scope', '$interval', '$state', 'SISOSprints',
    'ProfileFactory', '$ionicLoading', '$timeout',
    function ($scope, $interval, $state,
              SISOSprints, ProfileFactory, $ionicLoading, $timeout) {

      $scope.user = {fname: '', lname: ''};
      $scope.title = "Login - SISO";


      $scope.$on('$ionicView.afterEnter', function () {
        if (!ProfileFactory.isProfileEmpty()) {
          $scope.searchProfile(ProfileFactory.getProfile().fname, ProfileFactory.getProfile().lname);
        }
      });

      $scope.searchProfile = function (fname, lname) {

        var profileData = {};
        SISOSprints.getUserProfile({fname: fname, lname: lname}, function (recs) {

          if (typeof recs !== undefined && recs.length > 0) {

            $scope.record = recs[0];

            delete $scope.record["$promise"];
            delete $scope.record["$resolved"];
            delete $scope.record["__v"];

            Object.keys($scope.record).forEach(function (key) {
              profileData[key] = $scope.record[key];
            });

            ProfileFactory.setProfile(profileData);
            $state.go('tab.signInSignOut',{cache: false});
            return false;

          }
        }, function (error) {
          $ionicLoading.show({template: error.status + ', ' + error.statusText, noBackdrop: true, duration: 2200});
          alert(error.status + ', ' + error.statusText);
        });

      };


      $scope.searchUser = function (u) {
        var profileData = {};
        if (u.fname !== '' && u.lname !== '') {
          SISOSprints.getUserProfile(u, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {

              $scope.record = recs[0];

              delete $scope.record["$promise"];
              delete $scope.record["$resolved"];
              delete $scope.record["__v"];

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


    }]);
