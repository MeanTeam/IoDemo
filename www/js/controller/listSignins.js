angular.module('app.listSignins', ['ionic-modal-select'])


  .controller('listSigninsCtrl', ['$scope', 'SISOSprints', '$ionicLoading', '$ionicModal', '$ionicPopup',
    function($scope, SISOSprints, $ionicLoading, $ionicModal, $ionicPopup){

      $scope.user = {fname: 'asdf', lname: 'eds'};
      $scope.dialog = {title: 'Search Manager', buttonLabel:'Find Manager'}
      $scope.records = [];

      $ionicModal.fromTemplateUrl('templates/userDialog.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal){
        $scope.userDialog = modal;
      });

      $scope.$on('$ionicView.loaded', function () {

        $ionicModal.fromTemplateUrl('templates/userDialog.html', {
          scope: $scope,
          animation: 'slide-in-up',
          focusFirstInput: true
        }).then(function(modal){
          $scope.userDialog = modal;
        });
      });

      $scope.$on('$ionicView.enter', function () {
        $scope.userDialog.show();
      });


      $scope.searchUser = function(u) {
        if(u.fname !== '' && u.lname !== ''){

          SISOSprints.get({mfname: u.fname, mlname: u.lname}, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
              $scope.records = recs;
              //$ionicLoading.show({template: 'Manager Found!', noBackdrop: true, duration: 2200});
              $scope.userDialog.hide();
            }else{
              $ionicLoading.show({template: 'Manager Not Found!', noBackdrop: true, duration: 2200});
            }

          });
        }else{
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }
      };

  }]);
