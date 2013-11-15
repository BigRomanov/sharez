var $ = require('jquery');
require('buffertools');

var User = function(db, email, first_name, last_name, hash, salt) {
  this.db = db;
  this.type = "user"; // document type for the database

  this.email = email;
  this.first_name = first_name;
  this.last_name = last_name;
  this.hash = hash;
  this.salt = salt;
  this.confirmed = false;
  this.active = true;
  this.is_admin = false;
  this.created_at = new Date();
  this.updated_at = new Date();

}

User.prototype.toJSON = function() {
  return {
    "email": this.email,
    "type" : this.type,
    "first_name": this.first_name,
    "last_name": this.last_name,
    "hash": this.hash.toJSON(),
    "salt": this.salt,
    "confirmed": this.confirmed,
    "active": this.active,
    "created_at": this.created_at,
    "updated_at": this.updated_at,
    "is_admin" : this.is_admin
  }
}

User.prototype.fromJSON = function(body)
{
  $.extend(this, body);
  this.hash = new Buffer(this.hash); // convert hash array to buffer
}

// ===================================================
//   Define & add the design views
//====================================================  
User.initDB = function(db) {
  // TODO: We don't need this view really since email is our key at the moment, we might need other views here in time
  var designdoc = {
    "views": {
      "all_users": {
        "map": "function (doc) { if (doc.type == 'user') { emit(doc.email, doc) } }"
      }
    }
  };

  db.insert(designdoc, '_design/user', function(err, res) {
    if (err) {
      // Handle error
      console.log('Cannot add Design Doc!', err);
    } else {
      // Handle success
      console.log('Added Design Doc', res);
    }
  });
}

// Static methods
User.find_by_email = function(db, email, callback) {
  // Return the user by unique email
  db.get(email, {
    revs_info: true
  }, function(err, body) {
    if (err) {
      callback(err, body)
    } else {
      var user = new User(db);
      user.fromJSON(body);
      callback(err, user)
    }
  });
}

User.all = function(db, callback) {
  db.view('user', 'all_users', callback);
}

User.prototype.save = function(callback) {
  var db = this.db;
  var user = this;
  // Check if this user already exists in the database
  db.get(user.email, { revs_info: true }, function(err, existing) {
    if (err) {
      var user_json = user.toJSON();
      db.insert(user.toJSON(), user.email, function(err, body) {
        callback(err, body);
      });
    } else {
      // update
      var user_json = user.toJSON();
      user_json._rev = existing._rev;
      db.insert(user_json, user.email, function(err, body) {
        callback(err, body);
      });
    }
  });
}

User.prototype.confirm = function() {
  this.confirmed = true;
}

User.prototype.activate = function() {
  this.active = true;
}

User.prototype.deactivate = function() {
  this.active = false;
}

module.exports = User;