import _ from 'lodash';
import passport from 'passport';


function signin (req, res, next) {
    req.resources = req.resources || {};

    passport.authenticate('local', { failureRedirect: '/' }, (err, user, info) => {
        if (err || !user) {
            _.assign(req.resources, {
                data: { err: err || 'No user found' },
                page: '/'
            });

            return next();
        }

        req.logIn(user, () => {
            _.assign(req.resources, {
                data: { user: user },
                page: String('/user/').concat(user._id),
                shouldRedirect: true
            });

            return next();
        });
    })(req, res, next);
}

function signout (req, res, next) {
    req.resources = req.resources || {};

    req.logout();

    _.assign(req.resources, {
        info: 'Successfully logged out',
        shouldRedirect: true
    });

    return next();
}

export default { signin, signout };
