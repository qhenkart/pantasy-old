'use strict';

var client = require('./config/mongo');
var ObjectId = require('mongodb').ObjectID;

exports.checkPantID = function(req, res, cb){
  client.then(function(db){
    return db.collection('pants').findOneAsync({code:req.params.code}, {'_id': 0})
    .then(function(pant){
      if (!pant){
        //make new pant profile'
        console.log('no pant profile found, creating a new one...');
        var newPant = {
          code: req.params.code,
          photos: [],
          comments: []
        };
        db.collection('pants').insert(newPant);
        console.log('new pants created')
        cb(newPant)
      }else {
        console.log('pants retrieved')
        cb(pant)
      }
    })
    .then(function(err){
      if(handleError(err, res)) return;
    })
  })
}

exports.addComment = function(req, res, cb){
  console.log(req.body.comment)
  client.then(function(db){
    return db.collection('pants').update({code: req.body.code}, {$push: {
        comments: req.body.comment
    }})
    .then(function(success){
      console.log("successful posting")
      cb(success);
      client.then(function(db){
        return db.collection('users').update({id:req.user.id}, {$addToSet: {pants: req.body.code}})
      })
    })
    .then(function(err){
      if(handleError(err, res)) return;
    });
  });
}

exports.deleteComment = function(req, res, cb) {
  var comment = req.body.comment
  console.log('comment', comment)
  client.then(function(db){
    return db.collection('pants').update({code: req.body.code}, {$pull:{'comments': {'name': comment.name, "text": comment.text, "created_at": new Date(comment.created_at)}}})

    .then(function(success){


      console.log('deleted', success.result)
      cb(success.result)
    })
    .then(function(err){
      if(handleError(err,res)) return;
    })
  })
}

function handleError(err, res){
  if(err){
    console.error(err);
    var msg = {
      success: false,
      msg: "Error occured on the Server"
    }
    res.status(500).json(msg);
    return true;
  }else{
    return false;
  }
}
