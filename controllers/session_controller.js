// GET /login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req, res) {
  var login    = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {

    if (error) { // si hay error retornamos mensajes
      req.session.errors = [{"message": 'Se ha producido un error: '+error}];
      res.redirect("/login");
      return;
    };

    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de req.session.user
    req.session.user = {id:user.id, username:user.username};

    // Primera trasaccion
    var ahora = new Date();
    req.session.date = ahora.toString();

    // Redireccion a path anterior a login
    res.redirect(req.session.redir.toString());
  });
};

// DELETE /logout
exports.destroy = function(req, res) {
  delete req.session.user;
  // Redireccion a path anterior a logout
  res.redirect(req.session.redir.toString());
};

// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// MW de auto-logout
exports.autoLogout = function(req, res, next) {
  if (req.session.user) {
    var anterior = new Date(req.session.date);
    var ahora = new Date();
    if ((ahora - anterior) < 120000) {
      req.session.date = ahora.toString();
    } else {
      delete req.session.user;
      delete req.session.date;
      req.session.errors = [{"message": 'Su sesión ha caducado'}];
      res.redirect('/login');
    };
  };
  next();
};

