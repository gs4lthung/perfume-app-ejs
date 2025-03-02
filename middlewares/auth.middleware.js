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
  },
  adminAuthenticated: (req, res, next) => {
    if (req.session.member && req.session.member.isAdmin === true) {
      return next();
    }
    res.redirect('/');
  }
};
