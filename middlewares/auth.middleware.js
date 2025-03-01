module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.session.member) {
        return next();
      }
      res.redirect('/login');
    },
    forwardAuthenticated: (req, res, next) => {
      if (!req.session.member) {
        return next();
      }
      res.redirect('/');
    }
  };
  