import passport from 'passport';


function signin (req, res, next) {
    passport.authenticate('local', { failureRedirect: '/api/core/login' }, (err, user, info) => {
        if (err || !user) {
            return res.format({
                html: () => {
                    res.render('index', { error: err || 'No user found'});
                },

                json: () => {
                    res.send({ error: err || 'No user found'});
                }
            });
        }

        req.logIn(user, () => {
            return res.format({
                html: () => {
                    res.redirect('/api/core/user-info/' + user._id);
                },

                json: () => {
                    res.send(user);
                }
            });
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
