var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res) {
    res.sendFile('../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    // res.render(index);
});

// //checks if user is authenticated to manage front-end restrictions
// router.get('/auth/isAuthenticated', function(req, res){
//   var authorized = {};
//   authorized.auth = req.isAuthenticated();
//   res.json(authorized);
// });


module.exports = router;
