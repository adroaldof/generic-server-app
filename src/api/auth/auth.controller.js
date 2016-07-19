import _ from 'lodash';
import passport from 'passport';


function signin (req, res, next) {
    req.resources = req.resources || {};

    passport.authenticate('local', { failureRedirect: '/api/core/login' }, (err, user, info) => {
        if (err || !user) {
            _.assign(req.resources, {
                data: { err: err || 'No user found' },
                page: 'index'
            });

            return next();
        }

        req.logIn(user, () => {
            _.assign(req.resources, {
                data: { user: user },
                page: String('/api/core/user/').concat(user._id),
                shouldRedirect: true
            });

            return next();
        });
    })(req, res, next);
}

function signout(req, res, next) {
    req.logout();
    return res.format({
        html: () => {
            res.render('index', {});
        },

        json: () => {
            res.send({ info: 'Success logged out' });
        }
    });
}

export default { signin, signout };
