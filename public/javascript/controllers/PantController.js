'use strict';

angular.module('pantasy.pants', ['pantasy'])
  .controller('PantController', ['api',function(api){
    this.pant = {};
    this.val = '';
    this.hasPants = false;
    this.uploading = false;
    this.profile = false;
    this.authenticated = false;
    this.feedLimit = 2
    this.pants = [];

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
        }
        if(context.pant.comments.length){
          context.pant.comments = context.pant.comments.reverse();
          var images = [];
          context.pant.comments = context.pant.comments.map(function(comment){
            comment.created_at = moment(comment.created_at).fromNow();
            if(comment.imageUrl){
              images.push(comment.imageUrl);
            }
            return comment;
          })

          if(images.length) context.hasPants = true;
          context.profile = images[Math.floor(Math.random() * images.length)];
          api.getUser().then(function(resp){
            context.pants = resp.data.user.pants;
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
        context.uploading = true;
        api.postPhoto(image, photoCaption).success(function(result) {
          context.fetchPants();
          context.uploading = false;
        });
      })
    };

    this.authenticate = function(cb){
      var context = this;
      var user = api.currentUser();
      if(!user){
        api.checkAuth(function(user){
          if(user){
            debugger
            context.authenticated = true
            context.pants = user.pants;
            cb()
          }else{
            debugger
            context.openModal()     
          }
        })
      
      }else{
        context.authenticated = true
        context.pants = user.pants;
        cb() 
      }
    }

    this.showPhoto= function(image){
      this.openModal('<img class="img-responsive large" src='+image+' />');
    }
    debugger
    this.authenticate(function(){});
    this.fetchPants()
  }])


