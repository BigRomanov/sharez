
var Item = require('../../models/item'); 

module.exports.add_item = function(req, res) {
  // TODO: Handle the case when the autor is a logged in user (most likely in case of new item)
  var newItem = new Item(req.db, req.user.email, req.body.title, req.body.author, req.body.text, req.body.link);

  newItem.save(function(err, body) {
    if (err) { 
      console.error(err); 
      res.json({'error':err});
    } 
    else {
      res.json({'item' : body._id});    
    }
  });
};

module.exports.get_items = function(req, res) {
  Item.user_items(req.db, req.user.email, function(err, items) {
    if (err) { 
      console.error(err); 
      res.json({'error':err});
    } 
    else {
      console.log(items);
      res.json({'items' : items.rows});    
    }
  });
};