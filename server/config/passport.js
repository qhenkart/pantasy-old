var FacebookStrategy = require('passport-facebook').Strategy;
var client = require('./mongo');
var config = require('../../config.json');
var https = require('https');
var request = require('request');



module.exports = function(passport) {

  //serialize users into and deserialize users out of the session.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });


  passport.deserializeUser(function(id, done) {
    client.then(function(db){
      return db.collection('users').findOneAsync({id: id})
        .then(function(user){
          if(!user) {
            console.log("user not found in desiralize")
          }
          done(null, user);

        });
    })
  });


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
  passport.use(new FacebookStrategy({
      clientID: config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
//saves user data into database or logs them in if they already exist. Always updates
//facebook token

      facebookGET(accessToken, '/v2.5/' + profile.id +'/picture?redirect=0&type=large', function(data){
        var profilePhoto = data.data.url;
        client.then(function(db) {
          return db.collection('users').findOneAsync({ id: profile.id })
          .then(function(user) {
            if (!user) {
              console.log('user NOT found, creating a new one...');
              var newUser = {
                id: profile.id,
                name: profile.displayName,
                FBtoken: accessToken,
                profile: profilePhoto
              };
              db.collection('users').insert(newUser);
              return done(null, newUser);
            }
            else {
              console.log('user is found, re-setting accessToken...');
              db.collection('users').update(
                {_id: user._id},
                {$set:
                  {FBtoken : accessToken,
                    profile: profilePhoto
                  }
                }
              );
              return done(null, user);
            }
          });
        });
      })      


  }));
};


function facebookGET(accessToken, apiPath, callback, ampersand) {
  // creating options object for the https request
  var options = {
      // the facebook open graph domain
      host: 'graph.facebook.com',

      // secured port, for https
      port: 443,

      // apiPath is the open graph api path
      path: apiPath,

      // well.. you know...
      method: 'GET'
  };

  var buffer = '';
  // initialize the get request
  var request = https.get(options, function(result){
      result.setEncoding('utf8');

      // each data event of the request receiving
      // chunk, this is where i`m collecting the chunks
      // and put them together into one buffer...
      result.on('data', function(chunk){
          buffer += chunk;
      });

      // all the data received, calling the callback
      // function with the data as a parameter
      result.on('end', function(){
          callback(JSON.parse(buffer));
      });
  });

  // just in case of an error, prompting a message
  request.on('error', function(e){
      console.log('error from facebook.get(): '
                   + e.message);
  });

  request.end();
}

