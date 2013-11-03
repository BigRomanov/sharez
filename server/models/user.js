
var User = function(db, email, first_name, last_name, hash, salt) {
    this.db         = db;
    this.type       = "user"; // document type for the database
    
    this.email      = email;
    this.first_name = first_name;
    this.last_name  = last_name;
    this.hash       = hash;
    this.salt       = salt;
    this.created_at = new Date();
    this.updated_at = new Date();
    
}

User.prototype.toJSON = function()
{
    return {
        "email":      this.email,
        "first_name": this.first_name,
        "last_name":  this.last_name,
        "hash":       this.hash,
        "salt":       this.salt,
        "created_at": this.created_at,
        "updated_at": this.updated_at
    }
}

// ===================================================
//   Define & add the design views
//====================================================  
User.initDB = function(db) 
{
    var designdoc = {
        "views": {
            "user_by_email": {
                "map": "function (doc) { if (doc.type == 'user') { emit(doc.name, doc) } }"
            },
        }
    };

    db.save('_design/user', designdoc, function (err2, res) {
        if (err2) {
            // Handle error
            console.log('Cannot add Design Doc!', err2);
        } else {
            // Handle success
            console.log('Added Design Doc', res);
        }   
    });
}

// Static methods
User.find_by_email = function(db, email, callback)
{
    // Return the user by unique email
    db.get(email, { revs_info: true }, callback);
}

User.new = function(db, user_details)
{
    return new User(db, user_details); // a bit funny, is this necessary
}

User.all = function(db, callback)
{
    db.view('users_by_email', callback);
}

User.prototype.save = function(callback)
{
    console.log("Saving user");
    var db = this.db;
    var user = this;
    // Check if this user already exists in the database
    User.find_by_email(db, user.email, function(err, existing) {
        console.log(err);
        console.log(existing);
        if (err)
        {
            console.log("Create new user");
            db.insert(user.toJSON(), user.email, function(err, body) {
                callback(err, body);
            });
        }
        else
        {
            // update
            console.log("Update existing user");
            console.log(existing._rev);
            var user_json = user.toJSON();
            user_json._rev = existing._rev;
            db.insert(user_json, user.email, function(err, body) {
                callback(err, body);
            });
        }
    });
}

module.exports = User;