import express from 'express';


import authCtrl from '../auth/controller';
import response from '../../helpers/response-formatter/response-formatter';
import userCtrl from '../users/controller';


const router = express.Router();


router.route('/')
    .get(response.load({ info: 'Successfully got index' }, 'index'), response.send);

router.route('/register')
    .get(response.load({ info: 'Successfully got register' }, 'auth/register'), response.send)
    .post(userCtrl.create, response.load({}, 'user/info'), response.send);

router.route('/login')
    .get(response.load({ info: 'Successfully got login' }, 'auth/login'), response.send)
    .post(authCtrl.signin, response.send);

router.route('/user/:id')
    .get(userCtrl.load, response.send);

router.route('/user/:id/update')
    .get(userCtrl.load, response.load({}, 'user/update'), response.send)
    .post(userCtrl.load, userCtrl.update, response.load({}, 'user/info'), response.send);

router.route('/user/:id/password')
    .get(userCtrl.load, response.load({}, 'user/change-password'), response.send)
    .post(userCtrl.load, userCtrl.changePassword, response.load({}, 'user/info'), response.send);

router.route('/user/:id/remove')
    .get(userCtrl.load, userCtrl.remove, response.load({}, '/api/core'), response.send)
    .delete(userCtrl.load, userCtrl.remove, response.load({}, '/api/core'), response.send);

router.route('/logout')
    .get(authCtrl.signout, response.load({}, '/api/core'), response.send)


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
