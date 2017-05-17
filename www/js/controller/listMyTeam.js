angular.module('app.listMyTeam', ['ionic-modal-select'])


  .controller('listMyTeamCtrl', ['$scope', 'SISOSprints', '$ionicLoading', 'ProfileFactory', '$filter',
    function($scope, SISOSprints, $ionicLoading, ProfileFactory, $filter){

      $scope.user = {fname: '', lname: ''};
      $scope.records = [];
      $scope.reporters = false;

      $scope.$on('$ionicView.beforeEnter', function () {
         $scope.user.fname = ProfileFactory.getProfile().fname;
         $scope.user.lname = ProfileFactory.getProfile().lname;

        if($scope.user.fname !== '' &&  $scope.user.lname !== '') {

          SISOSprints.get({mfname: ProfileFactory.getProfile().fname, mlname: ProfileFactory.getProfile().lname}, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
              $scope.records = recs;
            }else{
              $scope.reporters = true;              
            }

          });
        }else{
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }

      });

    }]);
