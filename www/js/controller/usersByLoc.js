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
          var _fname = ProfileFactory.getProfile().fname;
          var _lname = ProfileFactory.getProfile().lname;
          var _mname = ProfileFactory.getProfile().mname;
          var _loc = '';

          if (_fname !== '' && _lname !== '') {

            SISOSprints.get({
              fname: _fname,
              lname: _lname,
              mname: _mname
            }, function (recs) {
              if (typeof recs !== undefined && recs.length > 0) {
                $scope.records = recs;
                
              } else {

                $scope.reporters = true;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.show({template: 'Sign-In to view information!', noBackdrop: true, duration: 2200});
              }
              $scope.location = recs[0].location;
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
              $scope.$broadcast('scroll.refreshComplete');
            });
          } else {
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
          };
      }

    }]);
