angular.module('app.usersByLoc', ['ionic-modal-select'])

  .controller('usersByLocCtrl', ['$scope', 'SISOSprints', '$ionicLoading', 'ProfileFactory',
    function($scope, SISOSprints, $ionicLoading, ProfileFactory){

      $scope.location = '';
      $scope.count = 0;
      $scope.records = [];

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.getUsersByLoc();
      });

      $scope.getUsersByLoc = function () {

        $scope.location = ProfileFactory.getProfile().preferredLocation;

        if($scope.location) {
          SISOSprints.usersByLoc({location: encodeURI($scope.location)}, function (rec) {
            $scope.count = rec.count;
            $scope.records = rec.users;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }else{
          $scope.$broadcast('scroll.refreshComplete');
          $ionicLoading.show({template: 'Location must not be empty!', noBackdrop: true, duration: 2200});
        }
      }

    }]);
