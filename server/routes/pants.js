var express = require('express');
var mongo = require('../mongoUtils')
var formidable = require('formidable');
var fs = require('fs-extra');
var util = require('util');
var AWS = require('aws-sdk');
var ObjectID = require('mongodb').ObjectID;
var config = require('../../config.json')

module.exports = function(passport) {
  var router = express.Router();

  router.get('/', function(req, res){
  })

  router.get('/:code', function(req, res) {
    res.redirect('/#/p/'+req.params.code);
  });

  router.get('/:code/info', function(req, res) {
    mongo.checkPantID(req, res, function(pant){
      res.json(pant)
    })
  });

  router.post('/comments',function(req, res){
    req.body.comment = {text: req.body.comment, created_at: new Date(), name: req.user.name, profile: req.user.profile, userID: req.user.id}
    mongo.addComment(req, res, function(resp){
      res.json(resp);
    })
    
  });

  router.post('/:code/upload', ensureAuthenticated,function (req, res){
    var form = new formidable.IncomingForm();
    var imageCaption = "";
    form.parse(req, function(err, fields, files) {
      if(err) console.log('err ', err);
      imageCaption = fields.imageCaption;

    });
    form.on('end', function(fields, files) {

      var file = this.openedFiles[0]
      var temp_path = file.path;
      var params = {
        Bucket: 'pantasy',
        Key: ObjectID().toString() + '.jpg',
        ACL: 'public-read',
        ContentType: file.type
      };
      var url = 'https://s3-us-west-1.amazonaws.com/pantasy/' + params.Key;
      req.body.comment = {imageUrl: url, text: imageCaption, created_at: new Date(), name: req.user.name, profile: req.user.profile, userID: req.user.id}
      req.body.code = req.params.code;

      fs.readFile(temp_path, function(err, data) {
        if (err) throw err;
        params.Body = data;

        s3.putObject(params, function (perr, pres) {
          if (perr) {
            console.log("Error uploading data: ", perr);
          } else {
            console.log("Successfully uploaded data to myBucket/myKey");
            mongo.addComment(req, res, function(){
              res.json({success:true, msg: 'photo uploaded'})
              
            })
          }
        });
      });
    });
  });

  return router;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }  
  console.log("user not logged in")  
  res.json({success:false, msg: 'You must be authenticated'})
} 

AWS.config.update({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secret
})

var s3 = new AWS.S3();

