var express = require('express');
var mongo = require('../mongoUtils')
var formidable = require('formidable');
var fs = require('fs-extra');
var util = require('util');

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
    console.log(req.params)
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });
    form.on('end', function(fields, files) {
      /* Temporary location of our uploaded file */
      var temp_path = this.openedFiles[0].path;
      /* The file name of the uploaded file */
      var file_name = 'pantID' + 'pantPhotoNumber'
      // this.openedFiles[0].name;
      /* Location where we want to copy the uploaded file */
      var new_location = 'uploads/';

      fs.copy(temp_path, new_location + file_name, function(err) {  
        if (err) {
          console.error(err);
        } else {
          console.log("success!")
        }
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
