angular.module('app.listMyTeam', ['ionic-modal-select'])


  .controller('listMyTeamCtrl', ['$scope', 'SISOSprints', '$ionicLoading', 'ProfileFactory',
    function($scope, SISOSprints, $ionicLoading, ProfileFactory){

      $scope.user = {fname: '', lname: ''};
      $scope.records = [];
      $scope.reporters = false;

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.getMyTeamList();
      });

      $scope.getMyTeamList = function () {
        $scope.user.fname = ProfileFactory.getProfile().fname;
        $scope.user.lname = ProfileFactory.getProfile().lname;

        if($scope.user.fname !== '' &&  $scope.user.lname !== '') {

          SISOSprints.getUsersByManager({mfname: ProfileFactory.getProfile().fname, mlname: ProfileFactory.getProfile().lname}, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
              $scope.records = recs;
            }else{
              $scope.reporters = true;
            }
            $scope.$broadcast('scroll.refreshComplete');
          });
        }else{
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }
      }

    }]);
