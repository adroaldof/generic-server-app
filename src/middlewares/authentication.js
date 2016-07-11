/**
 *  Checks if a user is authenticated or not
 *  content negotiation is present
 */
function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.format({
        html: () => {
            res.redirect('/core/signin');
        },

        json: () => {
            res.status(401).json({ message: 'Unauthorized' });
        }
    });
}

export default ensureAuthenticated;
