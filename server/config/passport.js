var FacebookStrategy = require('passport-facebook').Strategy;
var client = require('./mongo');
var config = require('../../config.json');




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
      clientID: config.id,
      clientSecret: config.secret,
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
//saves user data into database or logs them in if they already exist. Always updates
//facebook token
      client.then(function(db) {
        return db.collection('users').findOneAsync({ id: profile.id })
        .then(function(user) {
          if (!user) {
            console.log('user NOT found, creating a new one...');
            var newUser = {
              id: profile.id,
              name: profile.displayName,
              FBtoken: accessToken
            };
            db.collection('users').insert(newUser);
            return done(null, newUser);
          }
          else {
            console.log('user is found, re-setting accessToken...');
            db.collection('users').update(
              {_id: user._id},
              {$set:
                {FBtoken : accessToken}
              }
            );
            return done(null, user);
          }
        });
      });

  }));
};
