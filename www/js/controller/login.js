angular.module('app.login', ['ionic-modal-select'])

.controller('loginCtrl', ['$scope', '$location', 'SISOService', 'SISOFactory',
  function ($scope, $location, SISOService, SISOFactory) {
    $scope.user = {username: "", password: ""};

    $scope.goNext = function (path) {

      SISOService.getUserByUsername({username: $scope.user.username, password: $scope.user.password},
        function (userRec) {
          //console.log(userRec);
          if (userRec.success) {
            SISOFactory.set(userRec.record);
            $location.path(path);
          }else{
            //console.log(userRec);
            //
          }
        });
    };

    $scope.goToRegisterPage = function(){
        $location.path('/tab/register');
    }
    
  }])
