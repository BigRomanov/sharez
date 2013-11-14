
//GET /admin
// Render admin dashboard
module.exports.dashboard = function(req, res) {
  console.log(req.app.routes);
  res.render('admin/index', {
    user: req.user, 
    routes:req.app.routes
  });
};

module.exports.users = function(req, res) {
  res.render('admin/users', {
    user: req.user
  });
};

