angular.module('app.listSignins', ['ionic-modal-select'])


  .controller('listSigninsCtrl', ['$scope', 'SISOSprints', '$ionicLoading', '$ionicModal', '$ionicPopup', 'ProfileFactory', '$filter',
    function($scope, SISOSprints, $ionicLoading, $ionicModal, $ionicPopup,ProfileFactory, $filter){

      $scope.user = {fname: '', lname: ''};
      $scope.records = [];


      $scope.$on('$ionicView.beforeEnter', function () {
         $scope.user.fname = ProfileFactory.getProfile().fname;
         $scope.user.lname = ProfileFactory.getProfile().lname;

        if($scope.user.fname !== '' &&  $scope.user.lname !== '') {

          SISOSprints.get({mfname: ProfileFactory.getProfile().fname, mlname: ProfileFactory.getProfile().lname}, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
              $scope.records = recs;
            }else{
              $ionicLoading.show({template: 'No Users Signed In!', noBackdrop: true, duration: 2200});
            }

          });
        }else{
          $ionicLoading.show({template: 'User name must not be empty!', noBackdrop: true, duration: 2200});
        }

      });

      $scope.callDialog = function (number) {
        var confirmPopup = $ionicPopup.confirm({
            title:  $filter('tel')(number),
            template: '',
            cancelText: 'Cancel',
            okText: "<a class =\"call-white\" href=\"tel:+1" + number + "\">Call</a>"
        });
        confirmPopup.then(function (res) {
          if(res){
            window.open('tel:' + number, '_system');
          }
        });
      };


  }]);
