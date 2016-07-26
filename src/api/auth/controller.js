/* eslint-disable no-param-reassign */

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

        return req.logIn(user, () => {
            _.assign(req.resources, {
                data: { user },
                info,
                page: String('/user/').concat(user._id), // eslint-disable-line no-underscore-dangle
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
