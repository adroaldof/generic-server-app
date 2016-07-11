import express from 'express';


import accounts from '../accounts/accounts.controller';
import authCtrl from '../auth/auth.controller';
import userCtrl from '../users/users.controller';


const router = express.Router();


router.route('/')
    .get((req, res, next) => {
        return res.format({
            html: () => {
                res.render('index', {});
            },

            json: () => {
                res.send({
                    method: 'GET',
                    path: '/',
                    info: 'Success'
                });
            }
        });
    });

router.route('/login')
    .get((req, res, next) => {
        return res.format({
            html: () => {
                res.render('auth/login', {});
            },

            json: () => {
                res.send({
                    method: 'GET',
                    path: '/login',
                    info: 'Success'
                });
            }
        });
    })
    .post(authCtrl.signin);

router.route('/register')
    .get((req, res) => {
        return res.format({
            html: () => {
                res.render('auth/register', {});
            },

            json: () => {
                res.send({
                    method: 'GET',
                    path: '/register',
                    info: 'Success'
                });
            }
        });
    })
    .post(accounts.signup);

router.route('/user-info/:id')
    .get(userCtrl.load, (req, res, next) => {
        const user = req.resources.user;

        return res.format({
            html: () => {
                res.render('user/info', { user: user });
            },

            json: () => {
                res.send({
                    user: user,
                    info: 'Success loading user'
                });
            }
        });
    });

router.route('/user-update/:id')
    .get(userCtrl.load, (req, res, next) => {
        const user = req.resources.user;

        return res.format({
            html: () => {
                res.render('user/update', { user: user });
            },

            json: () => {
                res.send({
                    user: user,
                    info: 'Success loading user'
                });
            }
        });
    })
    .post(userCtrl.load, userCtrl.update, (req, res, next) => {
        const user = req.resources.user || {};

        return res.format({
            html: () => {
                res.render('user/info', { user: user });
            },

            json: () => {
                res.send({
                    user: user,
                    info: 'Success updating user'
                });
            }
        });
    });

router.route('/user-password/:id')
    .get(userCtrl.load, (req, res, next) => {
        const user = req.resources.user;

        return res.format({
            html: () => {
                res.render('user/change-password', { user: user });
            },

            json: () => {
                res.send({
                    user: user,
                    info: 'Success loading user'
                });
            }
        });
    })
    .post(userCtrl.load, userCtrl.changePassword, (req, res, next) => {
        const user = req.resources.user || {};

        return res.format({
            html: () => {
                res.render('user/info', { user: user });
            },

            json: () => {
                res.send({
                    user: user,
                    info: 'Success updating user'
                });
            }
        });
    });


router.route('/logout')
    .get(authCtrl.signout);


/**
 * System check route
 */
router.route('/json')
    .get((req, res) => {
        res.send({
            system: 'OK',
            info: 'System is up',
            now: new Date().toLocaleString('en-US')
        });
    })
    .post((req, res) => {
        const body = req.body.info;

        res.send({
            system: 'OK',
            info: body,
            now: new Date().toLocaleString('en-US')
        });
    });

export default router;
