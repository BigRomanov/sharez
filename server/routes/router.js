
var passport = require('passport');

// Include routes
var user  = require('./user_routes');
var admin = require('./admin_routes');
var item  = require('./api/item_routes');
var ui    = require('./ui_routes');

/* ==============================================================
    Here's all the routing
=============================================================== */
module.exports = function(app) {

  // --- GET Routes
  app.get('/', user.index);
  app.get('/signup', user.signup);
  app.get('/login', user.login);
  app.get('/passwdreset', user.passwdreset);
  app.get('/account', ensureAuthenticated, user.account);
  app.get('/logout', ensureAuthenticated, user.logout);
  app.get('/home', ensureAuthenticated, user.home);
  app.get('/confirm', user.confirm);

  // -- POST Routes
  app.post('/register', user.register);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // --- Error Routes (always last!)
  app.get('/404', user.fourofour);
  app.get('/403', user.fourothree);
  app.get('/500', user.fivehundred);

  // Admin
  app.get('/admin', admin.dashboard);
  app.get('/admin/user', admin.users);
  //app.get('/admin', ensureAuthenticated, admin.dashboard);
  //app.get('/admin/user', ensureAuthenticated, admin.users);

  // Admin widgets (AJAX)
  app.get('/admin/widgets/users', admin.users);
  //app.get('/admin/widgets/users', ensureAuthenticated, admin.users);

  // UI
  app.get('/ui/newitem', ensureAuthenticated, ui.newitem);

  // Extension

  //app.get('/extension', extension.drawer);
  //app.get('/extension/additem', extension.add_item_action);

  // API
  app.get('/api/items', item.get_items);
  app.post('/api/item', item.add_item);

};

// //////////////////////////////////////////////////////////////////////
/*  Simple route middleware to ensure user is authenticated.
 *  Use this route middleware on any resource that needs to
 *  be protected.  If the request is authenticated (typically
 *  via a persistent login session), the request will proceed.
 *  Otherwise, the user will be redirected to the login page.
 */
function ensureAuthenticated(req, res, next) {
  console.log("Make sure the call is authenticated");
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
