'use strict';

angular.module('pantasy.pants', ['pantasy'])
  .controller('PantController', ['api', function(api){
    this.pant = {};
    this.val = '';
    this.hasPants = false;

    this.openModal = function(content){
      content = content || '<a class="btn btn-primary" href="/auth/facebook" type="button">Login to Facebook</a>';
      Modal.open({ content: content });
    };

    this.fetchPants = function(){
      var context = this;
      api.fetchPant().then(function(resp){
        console.log('fetched')
        context.pant = resp.data;
        console.log(context.pant)
        if(context.pant.photos.length){
          context.hasPants = true;
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

      this.authenticate(function(){
        api.postComment(val).then(function(resp){
          context.fetchPants();
        }, 
        function(err){
           console.log(err);
        }) 
        
      })      
    }

    this.oauth = function(){
      api.login();
    }

    this.single = function(image, photoCaption) {
      var context = this;
      if(!photoCaption || /<|>/.test(photoCaption)) photoCaption = '';

      this.authenticate(function(){
         api.postPhoto(image, photoCaption).success(function(result) {
            context.fetchPants();
          });
      })
    };

    this.authenticate = function(cb){
      var context = this;
      if(!api.currentUser()){
        api.checkAuth(function(bool){
          if(bool){
            cb()
          }else{
            context.openModal()     
          }
        })
      
      }else{
        cb() 
      }
    }
    this.showPhoto= function(image){
      this.openModal('<img class="img-responsive large" src='+image+' />');
    }
    this.fetchPants()
  }])


