module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.session.user) {
        return next();
      }
      res.redirect('/login');
    },
    forwardAuthenticated: (req, res, next) => {
      if (!req.session.user) {
        return next();
      }
      res.redirect('/');
    }
  };
  