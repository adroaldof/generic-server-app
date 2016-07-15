import _ from 'lodash';

import User from '../users/users.model';

// TODO: change this to User crete
/* istanbul ignore next */
function signup (req, res, next) {
    // ToDo: Email and passowrd validation

    const userData = _.pick('name', 'email', 'password');

    User.register(userData, (err, user) => {
        if (err && (err.code === 11000 || err.code === 11001)) {
            return res.format({
                html: () => {
                    res.render('auth/register', { error: err });
                },

                json: () => {
                    res.send({ error: err });
                }
            });
        }

        if (err) {
            return res.format({
                html: () => {
                    res.render('auth/register', { error: err });
                },

                json: () => {
                    res.send({ error: err });
                }
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.format({
                    html: () => {
                        res.render('auth/register', { error: err });
                    },

                    json: () => {
                        res.send({ error: err });
                    }
                });
            }

            return res.format({
                html: () => {
                    res.render('user/info', { user: user });
                },

                json: () => {
                    res.send({ user: user });
                }
            });
        });
    });
}

export default { signup };
