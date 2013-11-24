
var Item = require('../../models/item'); 

module.exports.add_item = function(req, res) {
  var newItem = new Item(req.db, req.user, req.body.text, req.body.link);

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