var express = require('express');



module.exports = function(passport) {
  var router = express.Router();
  /* GET home page. */
  router.get('/', function(req, res) {
      res.sendFile('../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

  router.get('/marketing', function(req, res){
    res.redirect('http://www.givepantasy.com')
  })

  // router.get('/auth/facebook', function(req, res){
  //   req.session.something = req.headers.something
  //   console.log(req.headers.something, "authentication begingin")
  //   passport.authenticate('facebook')
  // });

  router.get('/auth/facebook',
    passport.authenticate('facebook'));
 

  // GET /auth/facebook/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      console.log(req.user)
      res.redirect(req.session.something);
  });

  

  //checks if user is authenticated to manage front-end restrictions
  router.get('/auth/isAuthenticated', function(req, res){
    req.session.something = req.headers.something;
    var authorized = {};
    authorized.auth = req.isAuthenticated();
    res.json({authorized: authorized.auth, user: req.user});
  });
  return router
}


