'use strict';

angular.module('pantasy')
  .factory('api', ['$http', '$location', function($http, $location){

    var currentUser;

    var fetchPant = function(){
      return $http.get($location.path()+'/info')
    }

    var login = function(){
      $http.get('/auth/facebook');
    };

    var getUser = function(){
      return $http.get('/user')
    }

    var checkAuth = function(cb){
      var config = { headers: { something: $location.path() } }; 
      $http.get('/auth/isAuthenticated', config).then(function(resp){
        if(resp.data.authorized){
          currentUser = resp.data.user;
          cb(currentUser)
        }else{
          cb(false)
        }
      })
    }

    var postComment = function(e){
      var code = $location.path().match(/[^\/p\/]/g).join('');
      return $http.post('/p/comments', {code: code, comment: e});
    }

    var removeComment = function(comment){
      var code = $location.path().match(/[^\/p\/]/g).join('');

      return $http.post('/p/deleteComment', {code: code, comment: comment})
    }

    var postPhoto = function(image, imageCaption){
      if(!image || image.length < 1) return;
      var formData = new FormData();

      var blob = dataURLtoBlob(image);
      formData.append("file", blob, "image.jpg");
      formData.append('imageCaption', imageCaption)

      return $http.post($location.path()+'/upload', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
    }

    return {
      fetchPant: fetchPant,
      postComment: postComment,
      checkAuth: checkAuth,
      login: login,
      postPhoto: postPhoto,
      getUser: getUser,
      removeComment: removeComment,
      currentUser: function(){return currentUser;}
    } 
   
  }])

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

  // $http.post('/someUrl', data, config).then(successCallback, errorCallback);