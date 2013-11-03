module.exports = function(app) {

  // --- GET Routes
  app.get('/', index);
  app.get('/signup', signup);
  app.get('/login', login);
  app.get('/passwdreset', passwdreset);
  app.get('/account', ensureAuthenticated, account);
  app.get('/logout', ensureAuthenticated, logout);
  app.get('/home', ensureAuthenticated, home);
}


/*
 * API routes
 */

exports.add_item = function(req, res){
  console.log(req.db);
  var newItem = req.body;
  newItem['type'] = 'link';

  req.db.insert(newItem, function(err) {
    if (err) { console.error(err); }
  });
  res.json('Item added');
};