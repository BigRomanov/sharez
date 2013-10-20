
/**
 * Module dependencies.
 */

var express = require('express');
var nano = require('nano');
var routes = require('./routes');
// Initialize resources
var user = require('./routes/user');
var extension = require('./routes/extension');
var api = require('./routes/api');

var http = require('http');
var path = require('path');

var app = express();
var couchdb = nano('http://localhost:5984');

couchdb.db.create('sharez', function(err) {
    if (err && err.status_code !== 412) {
        throw err;
    }
    var sharezDB = couchdb.use('sharez');

    var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
        function(username, password, done) {
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
    app.use(passport.initialize());
    app.use(passport.session());

    // Associate database reference with each request through middleware
    app.use(function(req,res,next){
        console.log("middleware")
        console.log(sharezDB);
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
    app.get('/users', user.list);
    app.get('/extension', extension.drawer);
    app.get('/extension/additem', extension.add_item_action);

    // Authentication routes
    app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

    app.post('/api/additem', api.add_item);

    // Initialize database, and create the http server
    
    http.createServer(app).listen(app.get('port'), function(){
       console.log('Express server listening on port ' + app.get('port'));
    });
});
