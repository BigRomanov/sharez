var $ = require('jquery');
require('buffertools');

var Item = function(db, user, title, author, text, link) {
  this.db = db;
  this.type = "item"; // document type for the database

  this.user  = user    // unique id (email) of the owner
  this.title = title;
  this.author = author;
  this.text  = text;
  this.link  = link;
  this.created_at = new Date();
  this.updated_at = new Date();
  this.tags  = [];
}

Item.prototype.toJSON = function() {
  return {
    "type"   : this.type,
    "user"   : this.user,
    "title"  : this.title,
    "author" : this.author,
    "text"   : this.text,
    "link"   : this.link,
    "tags"   : JSON.stringify(this.tags),
    "created_at": this.created_at,
    "updated_at": this.updated_at,
  }
}

Item.prototype.fromJSON = function(body)
{
  $.extend(this, body);
  this.hash = new Buffer(this.hash); // convert hash array to buffer
}

Item.prototype.addTag = function(tag, is_public, value) {
  this.tags.push({'tag':tag, 'type':'tag', 'value':value, 'is_public' : is_publics})
}

Item.user_items = function(db, user, callback) {
  db.view('item', 'user_items', { keys: [user] }, callback);
}

Item.prototype.save = function(callback) {
  var db = this.db;
  var item = this;
  var item_json = item.toJSON();
  // Check if this user already exists in the database
  db.get(item.id, { revs_info: true }, function(err, existing) {
    if (err) {
      db.insert(item_json, function(err, body) { callback(err, body); });
    } 
    else { // update
      item_json._rev = existing._rev;
      db.insert(item_json, item.id, function(err, body) { callback(err, body); });
    }
  });
}

// ===================================================
//   Define & add the design views
//====================================================  
Item.initDB = function(db) {
  // TODO: We don't need this view really since email is our key at the moment, we might need other views here in time
  var designdoc = {
    "views": {
      "all_items": {
        "map": "function (doc) { if (doc.type == 'item') { emit(doc._id, doc) } }"
      },
      "user_items": {
        "map": "function (doc) { if (doc.type == 'item') { emit(doc.user, doc) } }"
      } 
    }
  };

  db.insert(designdoc, '_design/item', function(err, res) {
    if (err) {
      console.log('Cannot add Design Doc!', err);
    } 
    else {
      console.log('Added Design Doc', res);
    }
  });
}

module.exports = Item;