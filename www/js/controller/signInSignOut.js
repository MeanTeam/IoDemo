angular.module('app.signInSignOut', ['ionic-modal-select'])

  .controller('signInSignOutCtrl', ['$scope', '$location', '$interval', 'SISOSprints', 'Locations', 'ProfileFactory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$filter', '$ionicNavBarDelegate',
    function ($scope, $location, $interval, SISOSprints, Locations, ProfileFactory, $ionicLoading, $ionicModal, $ionicPopup, $filter, $ionicNavBarDelegate) {

      $scope.user = {fname: '', lname: ''};
      $scope.dialog = {title: 'Search User', buttonLabel: 'Find User'};
      $scope.someModel = null;
      $scope.locations = Locations.get();//['Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'];
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
        $ionicNavBarDelegate.showBackButton(false);
        var userData = ProfileFactory.get();

        if (ProfileFactory.get()._id == undefined || ProfileFactory.get()._id == '') {
          SISOSprints.get({
            fname: ProfileFactory.get().fname,
            lname: ProfileFactory.get().lname,
            mname: ProfileFactory.get().mname,
          }, function (recs) {
            if (typeof recs !== undefined && recs.length > 0) {
              userData = recs[0];
              ProfileFactory.get()._id = userData._id;
            }
            Object.keys(userData).forEach(function (key) {
              if (key == 'time') {
                $scope.record[key] = $filter('date')(new Date(), 'h:mm:ss a');//.toLocaleTimeString().replace(/:\d+ /, ' ');
              } else {
                $scope.record[key] = userData[key];
              }
            });
          });
        }
        else {
          Object.keys(userData).forEach(function (key) {
            //console.log("id" + userData._id);
            if (key == 'time') {
              $scope.record[key] = $filter('date')(new Date(), 'h:mm:ss a');//.toLocaleTimeString().replace(/:\d+ /, ' ');
            } else {
              $scope.record[key] = userData[key];
            }
          });
        }
      });

      $scope.showCheckoutBtn = function () {
        return ($scope.record._id !== undefined) && ($scope.record._id !== '');
      };

      $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
      $scope.timePattern = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;

      $scope.save = function () {
        delete $scope.record._id;
        SISOSprints.post($scope.record, function (result) {
          if (typeof result !== undefined && typeof result._id !== undefined) {
            $scope.record._id = result._id;
            ProfileFactory.get()._id = result._id;
            $ionicLoading.show({template: 'Sign In successful!', noBackdrop: true, duration: 2200});
            $scope.record.time = $filter('date')(new Date(), 'h:mm a');
          } else {
            $ionicLoading.show({template: 'Sign In result error.', noBackdrop: true, duration: 2200});
          }
        }, function (error) {
          var confirmPopup = $ionicPopup.alert({
            title: '<b>Sign In Error</b>',
            template: error.status + ', ' + error.statusText
          });

          confirmPopup.then(function (res) {

          });
        });

      };

      $scope.delete = function () {

        var confirmPopup = $ionicPopup.confirm({
          title: '<b>Confirm Sign Out</b>',
          template: 'Sign Out will delete the record'
        });

        confirmPopup.then(function (res) {
          if (res && typeof $scope.record._id !== undefined && $scope.record._id !== "") {
            //console.log($scope.record._id);

            SISOSprints.delete({id: $scope.record._id}, function (success) {
              var profileData = ProfileFactory.get();
              // remove $scope.record._id and prepare for next sign-in
              profileData['_id'] = "";
              ProfileFactory.set(profileData);
              $scope.record._id = "";
              $scope.record.time = $filter('date')(new Date(), 'h:mm a');
              $ionicLoading.show({template: 'Sign Out successful!', noBackdrop: true, duration: 2200});
            }, function (error) {
              var confirmPopup = $ionicPopup.alert({
                title: '<b>Sign Out Error</b>',
                template: error.status + ', ' + error.statusText
              });
            });
          }
        });

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

      // recalculate every 5 min ---> [1000 * 60 * 5]
      $interval($scope.myDynamicTimes, 1000 * 60 * 5);

    }]);
