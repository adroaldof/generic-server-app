import express from 'express';


import accounts from '../accounts/accounts.controller';
import authCtrl from '../auth/auth.controller';
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
