angular.module('app.signInSignOut', ['ionic-modal-select'])

  .controller('signInSignOutCtrl', [
    '$scope', '$state', '$interval', 'SISOSprints', 'Locations', 'ProfileFactory',
    '$ionicLoading', '$ionicModal', '$ionicPopup', '$filter', '$ionicNavBarDelegate', '$window', '$ionicPlatform',
    function (
      $scope, $state, $interval, SISOSprints, Locations, ProfileFactory,
      $ionicLoading, $ionicModal, $ionicPopup, $filter, $ionicNavBarDelegate, $window, $ionicPlatform) {

      $scope.user = {fname: '', lname: ''};
      $scope.dialog = {title: 'Search User', buttonLabel: 'Find User'};
      $scope.someModel = null;
      $scope.locations = Locations.get();
      $scope.myTimes = [];

      $scope.record = {
        "_id": "",
        "fname": "",
        "mname": "",
        "lname": "",
        "mfname": "",
        "mlname": "",
        "contact": "",
        "location": "",
        "time": $filter('date')(new Date(), 'hh:mm a')
      };


      $scope.$on('$ionicView.afterEnter', function () {

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

            /*console.log('Record found:');
            console.log(recs[0]);*/

            var recData = recs[0];
            ProfileFactory.setSISO(recData);
            Object.keys(recData).forEach(function (key) {
              $scope.record[key] = recData[key];
            });

          } else {

            Object.keys(userData).forEach(function (key) {
              if (key === 'time') {
                $scope.record[key] = $filter('date')(new Date(), 'hh:mm a');
              } else if (key === 'preferredLocation') {
                $scope.record.location = userData[ key ];
              }else if(key === '_id'){
                delete $scope.record.id;
              } else {
                $scope.record[key] = userData[key];
              }
            });

            ProfileFactory.setSISO($scope.record);

          }


          if ($ionicPlatform.is("android")) {
            $window.db.transaction(function (tx) {
              var query = "SELECT _id, value FROM profiles WHERE _id = ? ";

              /*console.log('DEBUG SISO - After query');
              console.log('DEBUG SISO - $scope.record._id : ' + $scope.record._id);
              console.log('DEBUG SISO ' + JSON.stringify(userData));*/

              tx.executeSql(query, ["1"], function (tx, resultSet) {

                  /*console.log("DEBUG SISO - resultSet: " + resultSet);*/

                  var toSQLite = {};
                  Object.keys(userData).forEach(function (key) {
                    if (key === '_id') {
                      toSQLite[key] = $scope.record._id;
                    } else {
                      toSQLite[key] = userData[key];
                    }
                  });

                  if (resultSet.rows.length > 0) {
                    /*console.log('DEBUG SISO - resultSet.rows.length > 0 - Preparing Update');*/
                    // Update
                    query = "UPDATE profiles SET value = ? WHERE _id = ?";

                    tx.executeSql(query, [JSON.stringify(toSQLite), "1"], function (tx, res) {},
                      function (tx, error) {
                        console.log('UPDATE error: ' + error.message);
                      });

                  } else {
                    /*console.log('DEBUG SISO - profiles table does not exists - creating it');*/
                    // Insert
                    $window.db.transaction(function (tx) {
                      tx.executeSql('CREATE TABLE IF NOT EXISTS profiles (_id, value)');
                      tx.executeSql('INSERT INTO profiles VALUES (?,?)', ['1', JSON.stringify(toSQLite)]);
                      /*console.log('DEBUG SISO - profiles table created');*/
                    }, function (error) {
                      /*console.log('Transaction ERROR: ' + error.message);*/
                      $ionicPopup.alert({title: 'Transaction ERROR:', template: error.message});
                    }, function () {
                      console.log('Populated database OK');
                    });
                  }

                },
                function (tx, error) {
                  console.log('SELECT error: ' + error.message);
                });

            });
          }


          $ionicLoading.hide();

        }, function (error) {
          $ionicLoading.hide();
          $ionicPopup.alert({title: 'Error', template: 'Fail on Server connection'});
        });

      });

      $scope.showCheckoutBtn = function () {
        return ($scope.record._id !== undefined) && ($scope.record._id !== '');
      };

      $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
      $scope.timePattern = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;

      $scope.save = function () {
        delete $scope.record._id;
        $scope.record.time = $filter('date')(new Date(), 'h:mm a');
        SISOSprints.post($scope.record, function (result) {
          $ionicLoading.show({
            template: 'Loading Profile ...'
          });

          if (typeof result !== undefined && typeof result._id !== undefined) {
            $scope.record._id = result._id;
            ProfileFactory.getSISO()._id = result._id;
            $ionicPopup.alert({title: 'Sign In', template: 'Sign In successful!'});
          } else {
            $ionicPopup.alert({title: 'Sign In', template: 'Sign In result error.'});
          }
          $ionicLoading.hide();
        }, function (error) {
          $ionicLoading.hide();
          $ionicPopup.alert({title: 'Error', template: error.status + ', ' + error.statusText});
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
            $ionicPopup.alert({title: 'Sign Out', template: error.status + ', ' + error.statusText});
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
          title: $filter('tel')(number),
          template: '',
          cancelText: 'Cancel',
          okText: "<a class =\"call-white\" href=\"tel:+1" + number + "\">Call</a>"
        });
        confirmPopup.then(function (res) {
          if (res) {
            window.open('tel:' + number, '_system');
          }
        });
      };


      // recalculate every 5 min ---> [1000 * 60 * 5]
      $interval($scope.myDynamicTimes, 1000 * 60 * 5);


    }]);
