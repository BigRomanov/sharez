
/**
 * Module dependencies.
 */

var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;


var nano = require('nano');
var routes = require('./routes');
// Initialize resources
var user = require('./routes/user');
var extension = require('./routes/extension');
var api = require('./routes/api');

var http = require('http');
var path = require('path');

var couchdb = nano('http://localhost:5984');

// Initialize express app
var app = express();


couchdb.db.create('sharez', function(err) {
    if (err && err.status_code !== 412) {
        throw err;
    }

    var sharezDB = couchdb.use('sharez');


    // Passport initalization

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      findById(id, function (err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy({ usernameField: 'email' },
        function(username, password, done) {
            console.log("Authenticate: " + username);

            if (username === 'foo@foo.com' && password === 'bar')
            {
                done(null, { user: username });
            }
            else
            {
                done(null, false);
            }

            User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }));

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use( express.cookieParser() );
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(express.methodOverride());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    // Associate database reference with each request through middleware
    app.use(function(req,res,next){
        req.db = sharezDB;
        next();
    });

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }
    

    // Configure application routes
    app.get('/', routes.index);
    app.get('/home', routes.home);
    app.get('/users', user.list);
    app.get('/extension', extension.drawer);
    app.get('/extension/additem', extension.add_item_action);

    // Authentication routes
    //app.post('/login', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/' }));

    app.get('/login', function(req, res){
      res.render('login', { user: req.user, message: req.flash('error') });
    });

    app.post('/login', 
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        function(req, res) {
            res.redirect('/');
    });

    

    app.post('/api/additem', api.add_item);

    // Initialize database, and create the http server
    
    http.createServer(app).listen(app.get('port'), function(){
       console.log('Express server listening on port ' + app.get('port'));
    });

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/login')
    }

});
