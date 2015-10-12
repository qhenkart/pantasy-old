'use strict';

angular.module('pantasy.services', ['pantasy'])
  .factory('api', ['$http', '$location', function($http, $location){

    var fetchPant = function(){
      console.log($location.path())
      return $http.get($location.path())

    }

    var postComment = function(e){
      var code = $location.path().match(/[^\/p\/]/g).join('');
      return $http.post('/p/comments', {code: code, comment: e});
    }

    return {
      fetchPant: fetchPant,
      postComment: postComment
    } 
    
  }])

  // $http.post('/someUrl', data, config).then(successCallback, errorCallback);