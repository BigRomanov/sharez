
// Determine skin for request
function get_skin(req) {
  return 'default'; // TODO: Implement skin support
}

function view_path(req, view) {
  var view_path = 'skin/' + get_skin(req) + '/' + view;
  return view_path;
}

module.exports.newitem = function(req, res) {
  res.render(view_path(req, 'new_item'), {user: req.user} );
};

module.exports.item = function(req, res) {
  res.render(view_path(req, 'item'), {user: req.user} );
};


