'use strict';

angular.module('pantasy.pants', ['pantasy', 'pantasy.services'])
  .controller('PantController', ['api', function(api){
    this.pant = {};
    this.fetchPants = function(){
      var context = this;
      api.fetchPant().then(function(resp){
        console.log('fetched')
        context.pant = resp.data;
        console.log(context.pant)
        if(context.pant.photos.length){
          //populate photos
        }else{
          //show nothing
        }
        if(context.pant.comments.length){
          //populate comments
        }else{
          //show nothing
        }
      }, function(err){
        console.log('err', err)
      });
    } 

    this.fetchPants()

    this.newComment = function(val){
      console.log(val)
      var context = this;
      api.postComment(val).then(function(resp){
        console.log('resp', resp);
        context.fetchPants();
      }, function(err){
        console.log(err);
      })
    }
  }])
