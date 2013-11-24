//==============================================================
// Database intializations
//==============================================================
var nano = require('nano')
var couchdb = nano('http://localhost:5984');

// Initialize models
var User = require('./models/user'); 
var Item = require('./models/item'); 


couchdb.db.create('sharez', function(err) {
    if (err && err.status_code !== 412) {
        throw err;
    }

    var db = couchdb.use('sharez');
    
    // Initialize user views
    try {
      User.initDB(db);
    }
    catch(e) {
      console.log(e);
    }

    // Initialize item views
    try {
      Item.initDB(db);
    }
    catch(e) {
      console.log(e);
    }
});
