
/**
 * Module dependencies.
 */
require('coffee-script')

var http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , express = require('express')
  , nano = require('nano')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes');

// Initialize models
var User = require('./models/user');

// Initialize routes
var extension = require('./routes/extension');
var api = require('./routes/api');

var couchdb = nano('http://localhost:5984');

// Initialize express app
var app = express();


couchdb.db.create('sharez', function(err) {
    if (err && err.status_code !== 412) {
        throw err;
    }

    var sharezDB = couchdb.use('sharez');

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
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
    //app.get('/users', user.list);
    app.get('/extension', extension.drawer);
    app.get('/extension/additem', extension.add_item_action);

    // Initialize database, and create the http server
    
    http.createServer(app).listen(app.get('port'), function(){
       console.log('Express server listening on port ' + app.get('port'));
    });

    //==============================================================
    //    Application Routing
    //==============================================================

    require('./routes/users')(app);
    require('./routes/api')(app);

});
