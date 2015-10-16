'use strict';

angular.module('pantasy')
  .factory('api', ['$http', '$location', function($http, $location){

    var currentUser;

    var fetchPant = function(){
      console.log($location.path())
      return $http.get($location.path()+'/info')
    }

    var login = function(){
      $http.get('/auth/facebook');
    };

    var checkAuth = function(cb){
      var config = { headers: { something: $location.path() } }; 
      $http.get('/auth/isAuthenticated', config).then(function(resp){
        if(resp.data.authorized){
          currentUser = resp.data.user;
          cb(true)
        }else{
          cb(false)
        }
      })
    }

    var postComment = function(e){
      var code = $location.path().match(/[^\/p\/]/g).join('');
      return $http.post('/p/comments', {code: code, comment: e});
    }

    return {
      fetchPant: fetchPant,
      postComment: postComment,
      checkAuth: checkAuth,
      login: login,
      currentUser: function(){return currentUser;}
    } 
   
  }])



  // $http.post('/someUrl', data, config).then(successCallback, errorCallback);