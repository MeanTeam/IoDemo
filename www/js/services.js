angular.module('app.services', ['ngResource', 'ngStorage']).

constant('ApiEndpoint', {
  url : "https://nameless-island-29757.herokuapp.com"   //"http://localhost:8100"
})

.factory('SISOFactory', ['$localStorage', function($localStorage){
  $localStorage = $localStorage.$default({
    userData : {pin: "", name: "", manager: "", contact: ""}
  });

  var saveUser = function (user) {
    $localStorage.userData = user;
  };

  var getUser = function () {
    return $localStorage.userData;
  };

  return {
    set : saveUser,
    get : getUser
  };
}])

.service('SISOService', ['$resource', 'ApiEndpoint', function($resource, ApiEndpoint){
  console.log('EndPoint:', ApiEndpoint.url);

  return $resource('', {}, {
    save : {method: 'POST', url : ApiEndpoint.url + '/siso', cache: false, responseType: 'json'},
    get : {method: 'GET', url: ApiEndpoint.url + '/siso/:pin/status/:status', params: {pin : '@pin', status: '@status'}, cache: false, responseType : 'json' },
    update : {method: 'PUT', url: ApiEndpoint.url + '/siso/id/:id', params: {id:'@_id'},responseType: 'json'},
    list : {method: 'GET', url: ApiEndpoint.url + '/siso/list/:pin', params: {pin:'@pin'}, responseType: 'json'},
    getUserByPIN : {method: 'GET', url: ApiEndpoint.url + '/siso/user/:pin', params: {pin:'@pin'}, responseType: 'json'},
    getUserByUsername : {
      method: 'GET',
      url: ApiEndpoint.url + '/siso/user/username/:username/passw/:password',
      params: {
        username:'@username',
        passw: '@password'
      },
      responseType: 'json'},
    saveUser : {method: 'POST', url: ApiEndpoint.url + '/siso/user', cache: false, responseType: 'json'}
  });
}]);
