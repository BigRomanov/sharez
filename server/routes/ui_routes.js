
// Determine skin for request
function get_skin(req) {
  return 'default'; // TODO: Implement skin support
}

module.exports.newitem = function(req, res) {
  var view_path = 'skin/' + get_skin(req) + '/new_item'
  res.render(view_path, {user: req.user} );
};


