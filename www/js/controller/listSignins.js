angular.module('app.listSignins', ['ionic-modal-select'])


  .controller('listSigninsCtrl', ['$scope', 'SISOSprints', '$ionicLoading', '$ionicModal', '$ionicPopup', 'ProfileFactory',
    function($scope, SISOSprints, $ionicLoading, $ionicModal, $ionicPopup,ProfileFactory){

      $scope.user = {fname: '', lname: ''};
      $scope.records = [];


      $scope.$on('$ionicView.beforeEnter', function () {
        console.log("before enter" );
         $scope.user.fname = ProfileFactory.get().fname;
         $scope.user.lname = ProfileFactory.get().lname;

        if($scope.user.fname !== '' &&  $scope.user.lname !== '') {

          SISOSprints.get({mfname: ProfileFactory.get().mfname, mlname: ProfileFactory.get().mlname}, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
              $scope.records = recs;
            }else{
              $ionicLoading.show({template: 'Manager Not Found!', noBackdrop: true, duration: 2200});
            }

          });
        }else{
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }

      });


  }]);
