import express from 'express';


import accounts from '../accounts/accounts.controller';
import authCtrl from '../auth/auth.controller';
import response from '../../helpers/response-formatter/response-formatter';
import userCtrl from '../users/users.controller';


const router = express.Router();


router.route('/')
    .get(response.load({ info: 'Success getting index' }, 'index'), response.send);

router.route('/login')
    .get(response.load({ info: 'Success getting login' }, 'auth/login'), response.send)
    .post(authCtrl.signin, response.send);

router.route('/user/:id')
    .get(userCtrl.load, response.send);

router.route('/user/:id/update')
    .get(userCtrl.load, response.load({}, 'user/update'), response.send)
    .post(userCtrl.load, userCtrl.update, response.load({}, 'user/info'), response.send);

router.route('/user/:id/password')
    .get(userCtrl.load, response.load({}, 'user/change-password'), response.send)
    .post(userCtrl.load, userCtrl.changePassword, response.load({}, 'user/info'), response.send);

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
