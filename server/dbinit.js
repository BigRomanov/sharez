//==============================================================
// Database intializations
//==============================================================
var nano = require('nano')

// Initialize models
var User = require('./models/user'); 
var couchdb = nano('http://localhost:5984');

couchdb.db.create('sharez', function(err) {
    if (err && err.status_code !== 412) {
        throw err;
    }

    var db = couchdb.use('sharez');
    
    User.initDB(db);
});
