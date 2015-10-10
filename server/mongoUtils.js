'use strict';

var client = require('./config/mongo');
var ObjectId = require('mongodb').ObjectID;

exports.checkPantID = function(req, res, cb){
  client.then(function(db){
    return db.collection('pants').findOneAsync({code:req.params.code});
  })
  .then(function(pant){
    if (!pant){
      //make new pant profile'
      console.log('no pant profile found, creating a new one...');
      var newPant = {
        code: req.params.code
      };
      db.collection('pants').insert(newPant);
      cb(newPant)
    }else {
      cb(pant)
    }
  })
}