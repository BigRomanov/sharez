
/*
 * GET users listing.
 */

exports.drawer = function(req, res){
  res.render('drawer', { title: 'Welcome' });
};

exports.additem = function(req, res){
  res.render('extension/actions/add_item', { title: 'Welcome' });
};