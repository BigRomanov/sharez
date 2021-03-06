'use strict'
/* ==============================================================
    Include required packages / Module Dependencies
=============================================================== */
require('buffertools');

var path = require('path'), // http://nodejs.org/docs/v0.3.1/api/path.html
  nano = require('nano'),
  flash = require('connect-flash'), // https://npmjs.org/package/connect-flash 
  passport = require('passport'), // https://npmjs.org/package/passport
  LocalStrategy = require('passport-local').Strategy, // See above
  pass = require('pwd'); // https://github.com/visionmedia/node-pwd

var couchdb = nano('http://localhost:5984');
var db = couchdb.use('sharez');

var User = require('../models/user');
var EmailConfirmation = require('../models/email_confirmation');

/* ===================================================
   Needed for Passport 
====================================================== */
// Doesn't need to query via a view, can just get doc by id directly
function findById(id, fn) {
  User.find_by_email(db, id, function(error, result) {
    if (!error) {
      fn(null, result);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

/* ===================================================
   Needed for Passport 
====================================================== */
/* ===================================================
 * FINDBY: Looks up users in the database either by name
 *         or email address.
 *
 * @param {String} should 'Email'
 * @param {String} key you want, 'Dan' or 'dan@dan.com'
 * @param {Function} callback
 *
 * Examples:
 *   findBy('Username', 'Dan', callback)
 * ==================================================== */
function findBy(attr, val, callback) {
  db.get(val, function(err, res) { // we get the user by id
    if (err) {
      var msg = 'Error: ' + attr + ', ' + val;
      callback(msg, null);
    } else {
      callback(null, res);
    }
  });
}


/* ===================================================
   Needed for Passport 
====================================================== */
/*   Passport session setup.
 *   To support persistent login sessions, Passport needs to be able to
 *   serialize users into and deserialize users out of the session.  Typically,
 *   this will be as simple as storing the user ID when serializing, and finding
 *   the user by ID when deserializing.
 */
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user);
  });
});

/* ===================================================
   Needed for Passport 
====================================================== */
// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, 
// which accept credentials (in this case, a username and 
// password), and invoke a callback with a user object.  
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {

  // asynchronous verification, for effect...
  process.nextTick(function() {

    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure and set a flash message.  Otherwise, return the
    // authenticated `user`.

    findById(email, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) { // If no user found
        return done(null, false, {
          message: '<strong>Oh Snap!</strong> We do not recognize your email ' + email + '.'
        });
      } else {
        pass.hash(password.trim(), user.salt, function(error, hash) {
          if (error) {
            return done(error);
          }

          if (user.hash.equals(hash)) { // doesn't match
            return done(null, user);
          } else {
            return done(null, false, {
              message: '<strong>Oh Snap!</strong> Your password does not match.'
            });
          }
        });
      }
    });
  });
}));


/* ==============================================================
    Here's route code (the rendering function is placed in a 
    variable and called in the routing above)
=============================================================== */

//GET / (index)
///////////////////////////////////////////////////////////////
module.exports.index = function(req, res) {
  res.render('index', {
    user: req.user
  });
};

//GET /passwdreset
///////////////////////////////////////////////////////////////
module.exports.passwdreset = function(req, res) {
  res.render('passwdreset', {
    user: req.user,
    message: req.flash('error')
  });
};

//GET /home
///////////////////////////////////////////////////////////////
module.exports.home = function(req, res) {
  res.render('home', {
    user: req.user
  });
};

//GET /signup
///////////////////////////////////////////////////////////////
module.exports.signup = function(req, res) {
  res.render('signup', {
    user: req.user,
    message: req.flash('error')
  });
};

//GET /account
//////////////////////////////////////////////////////////////
module.exports.account = function(req, res) {
  res.render('account', {
    user: req.user
  });
};

module.exports.confirm = function(req, res) {
  if (req.user && user.confirmed) {
    res.redirect('/home');
  }
  else if (req.query.token) {
    EmailConfirmation.confirm(req.db, req.query.token, function(err, user) {
      if (user && user.confirmed) {
        res.redirect('/home');
      } else {
        res.render('resend_confirmation');
      }
    });
  } else {
    var Emailer, data, emailer, options;

    EmailConfirmation.new(req.db, req.user.email, function(emc) {
      emc.save(function(err, body) {
        options = {
          to: {
            email: req.user.email,
            name: req.user.first_name,
            surname: req.user.last_name,
            subject: "Please confirm you email to start using ShareZ",
          },
          template: "confirm"
        };

        data = {
          name: req.user.first_name,
          surname: req.user.last_name,
          token: emc.token
        };

        Emailer = require("../lib/emailer");

        emailer = new Emailer(options, data);

        emailer.send(function(err, result) {

          // TODO: Should we put the rendering here, to handle email sending errors?
          if (err) {
            return console.log(err);
          }
        });

        res.render('confirm', {
          user: req.user
        });
      });
    });
  }
}


//GET /login
//////////////////////////////////////////////////////////////
module.exports.login = function(req, res) {
  res.render('login', {
    user: req.user,
    message: req.flash('error')
  });
};

//GET /logout
///////////////////////////////
module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

///GET /404
///////////////////////////////
module.exports.fourofour = function(req, res, next) {
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
};

///GET /403
///////////////////////////////
module.exports.fourothree = function(req, res, next) {
  // trigger a 403 error
  var err = new Error('Not Allowed!');
  err.status = 403;

  // respond with html page
  if (req.accepts('html')) {
    res.render('403', {
      err: err,
      //url: req.url 
    });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({
      error: 'Not Allowed!'
    });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not Allowed!');

  next(err);
};

///GET /500
///////////////////////////////
module.exports.fivehundred = function(req, res, next) {
  // trigger a generic (500) error
  next(new Error('Testing 1,2,3!'));
};

//POST /signup
///////////////////////////////////////////////////////////////
module.exports.register = function(req, res) {
  findBy('email', req.body.email, function(err1, user1) {
    if (user1) { // Found email!  Bail out...
      console.log('Found email' + user1.username);
      req.flash('error', '<strong>Oh Snap!</strong> Sorry, We already have someone with that email address.');
      res.redirect('/signup');
    } else { // User email does not yet exist - OK

      pass.hash(req.body.password.trim(), function(err2, salt, hash) {
        if (err2) throw err;

        // store the salt & hash in the DB
        var user = new User(db, req.body.email, req.body.first_name, req.body.last_name, hash, salt)

        user.save(function(err3, result) {
          if (!err3) {
            // calling req.login below will make passportjs setup 
            // the user object, serialize the user, etc.
            // This has to be placed here *after* the database save 
            // because the result gives us an object with an .id 
            req.login(user, {}, function(err4) {
              if (err4) {
                console.log('Passport login did not work! ' + err4);
              } else {
                res.redirect("/confirm");
              }
            });
          } else {
            console.log('User save did not work!' + err);
            result.send(error.status_code);
          }
        });
      });
    }
  });
};