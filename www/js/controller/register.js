angular.module('app.register', ['ionic-modal-select'])


  .controller('registerCtrl', ['$scope', '$interval', '$location',
              'SISOSprints', 'Locations', 'ProfileFactory', '$ionicLoading', '$stateParams', '$ionicNavBarDelegate',
    function ($scope, $interval, $location,
              SISOSprints, Locations, ProfileFactory, $ionicLoading, $stateParams, $ionicNavBarDelegate) {

      $scope.user = {fname: '', lname: ''};
      $scope.locations = Locations.get();
      //$scope.dialog = {title: 'Login Page', buttonLabel: 'Login'};
      //$scope.someModel = null;
      $scope.cancelBtn = false;

      $scope.record = {
        "fname": "",
        "mname": "",
        "lname": "",
        "mfname": "",
        "mlname": "",
        "contact": "",
        "location": "",
        "manager": ""

      };

/*      $scope.managerOptions = function() {
        if($scope.managers !== undefined) {
        $scope.managers.forEach(function(managerProfile) {
          console.log("managerOptions :"+managerProfile.fname);
        });
      }
        return $scope.managers;
      }
*/
//      $scope.managers = [{'fname':'vasdf', 'lname':'sldkf', 'name':'vaskd sldkf'}];
      $scope.$on('$ionicView.beforeEnter', function () {
       SISOSprints.getManagerList({}, function(mgrs) {
         $scope.managers = [];
          Object.keys(mgrs).forEach(function(key) {
            if(key !== '$promise' && key !== '$resolved') {
//              var managerProfile = mgrs[key];
//              managerProfile.name = managerProfile.fname + ' ' + managerProfile.lname;
//              console.log(managerProfile);
//              $scope.managers.push(managerProfile);
              $scope.managers.push(mgrs[key]);
            }
          });
        }, function(error) {
          var confirmPopup = $ionicPopup.alert({
            title: '<b>Sign Out Error</b>',
            template: error.status+', '+error.statusText
          });
        });


        if ($stateParams.mode === 'home' && !ProfileFactory.isEmpty()) {

          $location.path('/tab/signInSignOut');
        } else {
          if($stateParams.mode === 'edit'){
            $scope.cancelBtn = true;
            $ionicNavBarDelegate.title('');
          }else{
            $scope.cancelBtn = false;
          }
          var profileData = ProfileFactory.get();
          Object.keys(profileData).forEach(function (key) {
            $scope.record[key] = profileData[key];
            console.log("register.beforeEnter: "+key+","+$scope.record[key]);
          });
        }

      });
/*
      var profileData = ProfileFactory.get();
      Object.keys(profileData).forEach(function(key) {
        $scope.record[key] = profileData[key];
        console.log("register.beforeEnter: "+key+","+$scope.record[key]);
      });
*/      $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;


      $scope.save = function () {
        var profileData = {};
<<<<<<< HEAD
        Object.keys($scope.record).forEach(function (key) {
          profileData[key] = $scope.record[key];
        });
=======
        Object.keys($scope.record).forEach(function(key) {
           profileData[key] =  $scope.record[key];
           if(key === 'mfname') {
             profileData[key] = $scope.record['managerProfile'].fname;
           } else
           if(key === 'mlname') {
             profileData[key] = $scope.record['managerProfile'].lname;
           }
           if(key === 'managerProfile') {
             console.log("-- register.save "+key+","+profileData[key].fname);
           } else {
           console.log("-- register.save "+key+","+profileData[key]);
          }
         });
>>>>>>> 3d1d526f8441422f22b00f7c390368d3d2040d88
        ProfileFactory.set(profileData);
        $ionicLoading.show({template: 'Registered!', noBackdrop: true, duration: 2200});
        $location.path('/tab/signInSignOut');
      };

<<<<<<< HEAD
      $scope.cancel = function(){
        $location.path('/tab/signInSignOut');
      };

    }]);
=======
  }])

  .directive("managerProfileDirective", function() {
    function link(scope, element, attrs) {
      Object.keys(element).forEach(function(key) {
        console.log(key+'='+element[key]);
      })
      console.log('**************** '+(typeof element));
        element.val('sdfdasdf');
    }
    return {
        link: link
    };
});
>>>>>>> 3d1d526f8441422f22b00f7c390368d3d2040d88
