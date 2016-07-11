import passport from 'passport';


function signin (req, res, next) {
    passport.authenticate('local', { failureRedirect: '/api/core/login' }, (err, user, info) => {
        if (err || !user) {
            return res.format({
                html: () => {
                    res.render('index', { error: err || 'Not user found'});
                },

                json: () => {
                    res.send({ error: err || 'Not user found'});
                }
            });
        }

        req.logIn(user, () => {
            return res.format({
                html: () => {
                    res.redirect('/api/core/user-info/' + user._id);
                },

                json: () => {
                    res.send({
                        user: user,
                        info: info
                    });
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
            res.send({ user: {} });
        }
    });
}

export default { signin, signout };
