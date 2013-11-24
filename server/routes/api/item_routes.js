
var Item = require('../../models/item'); 

module.exports.add_item = function(req, res) {
  var newItem = req.body;
  newItem['type'] = 'item';

  req.db.insert(newItem, function(err, body) {
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
  Item.user_items(req.db, req.user, function(err, items) {
    if (err) { 
      console.error(err); 
      res.json({'error':err});
    } 
    else {
      console.log(items);
      res.json({'items' : items});    
    }
  });
};