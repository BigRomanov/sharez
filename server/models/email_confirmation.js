var User = require('./user');

var EmailConfirmation = function(db, token, user_email) {
  this.db = db;
  this.type = "email_confirmation"; // document type for the database   

  this.user_email = user_email;
  this.token = token;

  this.created_at = new Date();
  this.updated_at = new Date();
}

EmailConfirmation.prototype.toJSON = function() {
  return {
    "user_email": this.user_email,
    "type" : this.type,
    "token" : this.token,
    "created_at": this.created_at,
    "updated_at": this.updated_at
  }
}

EmailConfirmation.generateToken = function(callback) {
  require('crypto').randomBytes(16, function(ex, buf) {
    var token = 'email_confirmation_';
    token += buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
    callback(token);
  });
}

EmailConfirmation.new = function(db, user_email, callback) {
  console.log("Create new verification token");
  EmailConfirmation.generateToken(function(token) {
    console.log(token);
    var emc = new EmailConfirmation(db, token, user_email);
    callback(emc);
  });

}

EmailConfirmation.confirm = function(db, token, callback) {
  db.get(token, { revs_info: true }, function(err, body) {
    var emc = body;
    if (err) {
      callback(err, body);  // Token was not found
    } else {
      User.find_by_email(db, body.user_email, function(err, user) {
        if (err) {
          callback(err, user);
        } else {
          user.confirm();
          user.save(function(err,body) {
            db.destroy(token, emc._rev, function(err, body){
              callback(err, user);  
            });
          });
        }
      });
    }
  });
}

// Object methods
EmailConfirmation.prototype.save = function(callback) {
  console.log("Saving EmailConfirmation");
  var db = this.db;
  var self = this;

  db.get(self.token, { revs_info: true }, function(err, existing) {
    if (err) {
      db.insert(self.toJSON(), self.token, function(err, body) {
        callback(err, body);
      });
    } else {
      console.log("ERROR: Duplicate token");
      // TODO: Handle this rare case of duplicate token
    }
  });
}

module.exports = EmailConfirmation;