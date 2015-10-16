'use strict';

angular.module('pantasy.pants', ['pantasy'])
  .controller('PantController', ['api', function(api){
    this.pant = {};
    

    this.openModal = function(content){
      Modal.open({ content: '<a class="btn btn-primary" href="/auth/facebook" type="button">Login to Facebook</a>' });
    };



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
          context.pant.comments = context.pant.comments.reverse();
          context.pant.comments = context.pant.comments.map(function(comment){
            comment.created_at = moment(comment.created_at).fromNow();
            return comment;
          })
        }else{
          context.pant.comments.push({text:"No Comments Yet"})
        }
      }, function(err){
        console.log('err', err)
      });
    } 

    this.newComment = function(val){
      if(!val || val.length < 1) return;
      var context = this;
      if(!api.currentUser()){
        api.checkAuth(function(bool){
          if(bool){
            debugger;
            console.log(val)
            api.postComment(val).then(function(resp){
              console.log('resp', resp);
              context.fetchPants();
            }, function(err){
              console.log(err);
            }) 
            
          }else{
            this.openModal()     
            
          }
        })
      
      }
    }
    this.oauth = function(){
      api.login();
    }


    this.fetchPants()
  }])


