var User = require('../models/user'); 

module.exports.dashboard = function(req, res) {
  res.render('admin/dashboard', {
    user: req.user, 
    routes:req.app.routes
  });
};

module.exports.users = function(req, res) {
  User.all(req.db, function(err, users_) {
    console.log(users_);
    res.render('admin/users', {
      users: users_['rows']
    });
  });
  
};

