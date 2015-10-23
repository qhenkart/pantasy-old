'use strict';

angular.module('pantasy.pants', ['pantasy'])
  .controller('PantController', ['api',function(api){
    this.pant = {};
    this.val = '';
    this.hasImage = false;
    this.hasPants = false;
    this.uploading = false;
    this.profile = false;
    this.authenticated = false;
    this.feedLimit = 5
    this.pantLength = 0
    this.tab = false;
    this.userId = '';
    this.pants = [];

    this.openModal = function(content){
      content = content || '<a class="btn btn-primary" href="/auth/facebook" type="button">Login to Facebook</a>';
      Modal.open({ content: content });
    };

    this.handleMore = function(){
      this.feedLimit += 5
      if(this.feedLimit >= this.pantLength) {
        this.hasPants = false;
        this.feedLimit = this.pantLength
      }
    }

    this.fetchPants = function(){
      var context = this;
      api.fetchPant().then(function(resp){
        console.log('fetched')
        context.pant = resp.data;
        console.log(context.pant)
        if(context.pant.photos.length){
        }
        if(context.pant.comments.length){
          context.pantLength = context.pant.comments.length
          if(context.pant.comments.length > 5) context.hasPants = true;
          context.pant.comments = context.pant.comments.reverse();
          var images = [];
          context.pant.comments = context.pant.comments.map(function(comment){
            comment.reformattedCreated_at = moment(comment.created_at).fromNow();
            if(comment.imageUrl){
              images.push(comment.imageUrl);
            }
            return comment;
          })

          if(images.length) context.hasImage = true;
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
            context.authenticated = true
            context.pants = user.pants;
            context.userId = user.id
            cb()
          }else{
            if(context.tab){
              context.openModal()     
            }else{
              context.tab = true;
            }
          }
        })
      
      }else{
        context.authenticated = true
        context.pants = user.pants;
        context.userId = user.id

        cb() 
      }
    }

    this.removeComment = function(comment){
      var context = this;
      api.removeComment(comment).then(function(resp){
        context.fetchPants();

      }).then(function(err){console.log(err)})
    }

    this.showPhoto= function(image){
      this.openModal('<img class="img-responsive large" src='+image+' />');
    }
    this.authenticate(function(){return;})

    this.fetchPants()
  }])


