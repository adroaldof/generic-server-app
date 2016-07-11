import express from 'express';


import accounts from '../accounts/accounts.controller';
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
        res.render('login', {});
    });

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

router.route('/logout')
    .get((req, res, next) => {
        res.render('index', {});
    });


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
