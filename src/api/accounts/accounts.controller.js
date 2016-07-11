import _ from 'lodash';
import mongoose from 'mongoose';

// const User = mongoose.model('User');
import User from '../users/users.model';


// function signup (req, res, next) {
function signup (req, res, next) {
    // ToDo: Email and passowrd validation

    const userData = _.pick(req.body, 'email', 'password');

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
