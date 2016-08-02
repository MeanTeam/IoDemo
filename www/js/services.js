angular.module('app.services', ['ngResource', 'ngStorage']).

constant('ApiEndpoint', {

  // url : 'https://lit-basin-60588.herokuapp.com/api/:path'  <<< USE this for Mobile Device
   url: '/api/:path'                                        // <<< USE this for web testing
  //url : 'https://lit-basin-60588.herokuapp.com/api/:path' // ionic proxy
})

.factory('Managers', [function(){
  var getManagers = function () {
    return [{'fname':'Manager 1'}];
  };

  return {
    get : getManagers
  };
}])
.factory('Locations', [function(){
  var getLocations = function () {
    return ['Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5', 'Location 6'];
  };

  return {
    get : getLocations
  };
}])

.factory('Managers', [function(){
  var getLocations = function () {
    return ['Manager 6'];
  };

  return {
    get : getLocations
  };
}])
.factory('ProfileFactory', ['$localStorage', function($localStorage){

  $localStorage = $localStorage.$default({
    profileData : {},
    sisoData    : {}
  });

  var saveSISO = function (user) {
    $localStorage.sisoData = user;
  };

  var getSISO = function () {
    return $localStorage.sisoData;
  };

  var isSISOEmptyObj = function(){
    return Object.keys($localStorage.sisoData).length === 0 && $localStorage.sisoData.constructor === Object;
  };


  var saveProfile = function (user) {
    $localStorage.profileData = user;
  };

  var getProfile = function () {
    return $localStorage.profileData;
  };

  var isProfileEmptyObj = function(){
    return Object.keys($localStorage.profileData).length === 0 && $localStorage.profileData.constructor === Object;
  };

  var resetObj = function(){
    saveSISO({});
    saveProfile({});
  };

  return {
    setProfile : saveProfile,
    getProfile : getProfile,
    setSISO : saveSISO,
    getSISO : getSISO,
    reset: resetObj,
    isProfileEmpty: isProfileEmptyObj,
    isSISOEmpty: isSISOEmptyObj
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
}])

.service('SISOSprints', ['$resource', 'ApiEndpoint', function($resource, ApiEndpoint){
  return $resource('', {},{
    get : {method: 'GET', url: ApiEndpoint.url, cache: false, params: {path:'sisoweb',fname:'@fname', lname: '@lname'}, responseType: 'json', isArray:true},
    post : {method: 'POST', url: ApiEndpoint.url, cache: false, params: {path:'sisoweb'} ,responseType: 'json'},
    delete: {method: 'DELETE', url: ApiEndpoint.url + '/:id', params: {path:'sisoweb',id:'@_id'} ,cache: false, responseType: 'json'},
    getUserProfile: {method: 'GET', url: ApiEndpoint.url, params: {path:'profiles',fname:'@fname', lname: '@lname'}, isArray:true, cache: false, responseType: 'json'},
    getManagerList: {method: 'GET', url: ApiEndpoint.url + '?role=manager', params: {path:'profiles'}, isArray:true, cache: false, responseType: 'json'},
    getUsersByManager: {method: 'GET', url: ApiEndpoint.url, params: {path:'profiles',mfname:'@fname',mlname:'@lname'}, isArray:true, cache: false, responseType: 'json'},
    postProfile : {method: 'POST', url: ApiEndpoint.url, cache: false, params: {path:'profiles'} ,responseType: 'json'},
    deleteProfile: {method: 'DELETE', url: ApiEndpoint.url + '/:id', params: {path:'profiles',id:'@_id'} ,cache: false, responseType: 'json'},
    updateProfile: {method: 'PUT', url: ApiEndpoint.url + '/:id', params: {path:'profiles',id:'@_id'} ,cache: false, responseType: 'json'}
  });
}]);
