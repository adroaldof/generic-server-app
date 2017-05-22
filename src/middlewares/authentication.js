export async function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.format({
    html: () => {
      res.redirect('/core/signin');
    },

    json: () => {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });
}

