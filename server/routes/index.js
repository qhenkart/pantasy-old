var express = require('express');



module.exports = function(passport) {
  var router = express.Router();
  /* GET home page. */
  router.get('/', function(req, res) {
      res.sendFile('../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

  router.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {
  });

  // GET /auth/facebook/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#/signin' }),
    function(req, res) {
      res.redirect('/#/app');
  });

  

  //checks if user is authenticated to manage front-end restrictions
  router.get('/auth/isAuthenticated', function(req, res){
    var authorized = {};
    authorized.auth = req.isAuthenticated();
    res.json(authorized);
  });
  return router
}


