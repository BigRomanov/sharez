
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'ShareZ' });
};

exports.home = function(req, res){
  res.render('home', { title: 'ShareZ' });
};