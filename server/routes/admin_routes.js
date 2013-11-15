module.exports.dashboard = function(req, res) {
  res.render('admin/dashboard', {
    user: req.user, 
    routes:req.app.routes
  });
};

module.exports.users = function(req, res) {
  res.render('admin/users', {
    user: req.user
  });
};

