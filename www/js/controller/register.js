angular.module('app.register', ['ionic-modal-select'])

  .controller('registerCtrl', ['$scope', '$interval', '$location', 'SISOSprints', 'Locations', 'ProfileFactory', 'SISOFactory','$ionicLoading', '$ionicModal', '$ionicPopup',
    function($scope, $interval, $location, SISOSprints, Locations, ProfileFactory, SISOFactory, $ionicLoading, $ionicModal, $ionicPopup){

      $scope.user = {fname: '', lname: ''};
      $scope.locations = Locations.get();//['Location 1', 'Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'];
      $scope.dialog = {title: 'Login Page', buttonLabel:'Login'};
      $scope.someModel = null;

      $scope.record = {
            "fname": "",
            "mname": "",
            "lname": "",
            "mfname": "",
            "mlname": "",
            "contact": "",
            "location": "",
            "time": new Date().toLocaleTimeString().replace(/:\d+ /, ' '),
            "manager": ""
      };

      $scope.$on('$ionicView.beforeEnter', function () {

       if(!ProfileFactory.isEmpty()){
          $location.path('/tab/signInSignOut');
        }else{
          var profileData = ProfileFactory.get();
          Object.keys(profileData).forEach(function(key) {
            $scope.record[key] = profileData[key];
          });
        }
      
      });


      $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;


      $scope.save = function() {        
        var profileData = {};
        var userData = {};
        Object.keys($scope.record).forEach(function(key) {
           profileData[key] =  $scope.record[key];
           userData[key] =     $scope.record[key];
         });
        ProfileFactory.set(profileData);
        SISOFactory.set(userData);
        $ionicLoading.show({template: 'Registered!', noBackdrop: true, duration: 2200});
        $location.path('/tab/signInSignOut');
      };



  

  }]);
