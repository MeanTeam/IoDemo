angular.module('app.signInSignOut', ['ionic-modal-select'])

  .controller('signInSignOutCtrl', ['$scope', '$state', '$interval', 'SISOSprints', 'Locations', 'ProfileFactory',
      '$ionicLoading', '$ionicModal', '$ionicPopup', '$filter', '$ionicNavBarDelegate',
    function ($scope, $state, $interval, SISOSprints, Locations, ProfileFactory, $ionicLoading, $ionicModal,
      $ionicPopup, $filter, $ionicNavBarDelegate) {

      $scope.user = {fname: '', lname: ''};
      $scope.dialog = {title: 'Search User', buttonLabel: 'Find User'};
      $scope.someModel = null;
      $scope.locations = Locations.get();
      $scope.myTimes = [];

      $scope.record = {
        "fname": "",
        "mname": "",
        "lname": "",
        "mfname": "",
        "mlname": "",
        "contact": "",
        "location": "",
        "time": $filter('date')(new Date(), 'h:mm a')
      };



      $scope.$on('$ionicView.beforeEnter', function () {

        if (ProfileFactory.isProfileEmpty()) {
          $state.go('/tab/register');
          return false;
        }

        $ionicNavBarDelegate.showBackButton(false);

        var userData = ProfileFactory.getProfile();
          $ionicLoading.show({
            template: 'Loading Profile ...'
          });
          SISOSprints.get({
            fname: ProfileFactory.getProfile().fname,
            lname: ProfileFactory.getProfile().lname,
            mname: ProfileFactory.getProfile().mname,
          }, function (recs) {

            if (typeof recs !== undefined && recs.length > 0) {
              userData = recs[0];
              ProfileFactory.setSISO(userData);
              ProfileFactory.getSISO()._id = userData._id;
              Object.keys(userData).forEach(function (key) {
                 $scope.record[key] = userData[key];
              });
            }
            else {
                Object.keys(userData).forEach(function (key) {
                  //console.log("id" + userData._id);
                  if (key == 'time') {
                    $scope.record[key] = $filter('date')(new Date(), 'h:mm a');//.toLocaleTimeString().replace(/:\d+ /, ' ');
                  }
                  else if(key == 'preferredLocation'){
                     $scope.record.location = userData[key];
                  }
                  else {
                    $scope.record[key] = userData[key];
                  }
                });
                ProfileFactory.setSISO($scope.record);
                ProfileFactory.getSISO()._id = '';
            }
            $ionicLoading.hide();

          }, function (error) {
            $ionicLoading.hide();
            $ionicPopup.alert({title: 'Error', template: 'Fail on Server connection' });
          });

      });

      $scope.showCheckoutBtn = function () {
        return ($scope.record._id !== undefined) && ($scope.record._id !== '');
      };

      $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
      $scope.timePattern = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;

      $scope.save = function () {
        delete $scope.record._id;
        SISOSprints.post($scope.record, function (result) {
          $ionicLoading.show({
            template: 'Loading Profile ...'
          });

          if (typeof result !== undefined && typeof result._id !== undefined) {
            $scope.record._id = result._id;
            ProfileFactory.getSISO()._id = result._id;
            $ionicPopup.alert({title: 'Sign In', template: 'Sign In successful!' });
          } else {
            $ionicPopup.alert({title: 'Sign In', template: 'Sign In result error.' });
          }
          $ionicLoading.hide();
        }, function (error) {
          $ionicLoading.hide();
          $ionicPopup.alert({title: 'Error', template: error.status + ', ' + error.statusText });
        });

      };

      $scope.delete = function () {
          if (typeof $scope.record._id !== undefined && $scope.record._id !== "") {
            SISOSprints.delete({id: $scope.record._id}, function (success) {
              var sisoData = ProfileFactory.getSISO();
              // remove $scope.record._id and prepare for next sign-in
              sisoData['_id'] = "";
              ProfileFactory.setSISO(sisoData);
              $scope.record._id = "";
              $scope.record.time = $filter('date')(new Date(), 'h:mm a');
              $ionicPopup.alert({title: 'Sign Out', template: 'Sign Out Successful!'});
            }, function (error) {
              $ionicPopup.alert({title: 'Sign Out', template: error.status + ', ' + error.statusText });
            });
          }
      };

      $scope.myDynamicTimes = function () {

        var currentTime = new Date();
        var remainMinutes = currentTime.getMinutes() % 15;
        var quarter = Math.floor(currentTime.getMinutes() / 15);
        if (remainMinutes > 7) {
          quarter++;
        }
        if (quarter <= 3) {
          currentTime.setMinutes(quarter * 15, 0, 0);
        } else {
          currentTime.setHours(currentTime.getHours() + 1, 0, 0, 0);
        }
        currentTime = new Date(currentTime.getTime() - 1000 * 60 * 15 * 3);
        // creates times for every lapse of times (15 minutes --> [1000 * 60 * 15])
        if ($scope.myTimes.length === 0 || getLapseOfTime(currentTime) !== $scope.myTimes[0]['hour']) {
          for (var i = 0; i < 7; i++) {
            $scope.myTimes[i] = {"hour": getLapseOfTime(currentTime), "checked": false};
            currentTime = new Date(currentTime.getTime() + (1000 * 60 * 15));
          }
        }

        function precision(n) {
          return (n * 100) / 100;
        }

        function getLapseOfTime(date) {
          return $filter('date')(date, 'h:mm a');
        }

      };
      // calculate for first-time
      $scope.myDynamicTimes();

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


      // recalculate every 5 min ---> [1000 * 60 * 5]
      $interval($scope.myDynamicTimes, 1000 * 60 * 5);


    }]);
