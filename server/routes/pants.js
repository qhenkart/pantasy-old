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
    //browse pants
  })

  router.get('/:code', function(req, res) {
    res.redirect('/#/p/'+req.params.code);
  });

  router.get('/:code/info', function(req, res) {
    console.log('getting ', req.params.code)
    mongo.checkPantID(req, res, function(pant){
      res.json(pant)
    })
  });

  router.post('/comments',function(req, res){
    console.log('postd coment')
    req.body.comment = {text: req.body.comment, created_at: new Date(), name: req.user.name, profile: req.user.profile}
    mongo.addComment(req, res, function(resp){
      res.json(resp);
    })
    
  });

  router.post('/:code/upload', ensureAuthenticated,function (req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      console.log('err ', err)

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

      fs.readFile(temp_path, function(err, data) {
        if (err) throw err;
        params.Body = data;

        s3.putObject(params, function (perr, pres) {
          if (perr) {
            console.log("Error uploading data: ", perr);
          } else {
            console.log("Successfully uploaded data to myBucket/myKey");
            res.end()
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

