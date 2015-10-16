'use strict';

angular.module('pantasy.pants', ['pantasy'])
  .controller('PantController', ['api', function(api){
    this.pant = {};
    this.val = '';

    this.openModal = function(content){
      Modal.open({ content: '<a class="btn btn-primary" href="/auth/facebook" type="button">Login to Facebook</a>' });
    };



    this.fetchPants = function(){
      debugger

      var context = this;
      api.fetchPant().then(function(resp){
      debugger

        console.log('fetched')
        context.pant = resp.data;
        console.log(context.pant)
        if(context.pant.photos.length){
          //populate photos
        }else{

        }
        if(context.pant.comments.length){
          context.pant.comments = context.pant.comments.reverse();
          context.pant.comments = context.pant.comments.map(function(comment){
            comment.created_at = moment(comment.created_at).fromNow();
            return comment;
          })
        }else{
          context.pant.comments.push({text:"No Comments Yet", profile:'../images/pantsicon.jpg'})
        }
      }, function(err){
        console.log('err', err)
      });
    } 

    this.newComment = function(val){
      if(!val || val.length < 1 || /<|>/.test(val)) return;
      var context = this;
      console.log(api.currentUser())
      if(!api.currentUser()){
        api.checkAuth(function(bool){
          if(bool){
           return;
          }else{
            context.openModal()     
          }
        })
      
      }else{
        api.postComment(val).then(function(resp){

          $('#comment-field').val('')

          context.fetchPants();
        }, function(err){
          console.log(err);
        }) 
      }
    }
    this.oauth = function(){
      api.login();
    }



    this.fetchPants()
  }])


