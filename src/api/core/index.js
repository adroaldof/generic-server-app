import express from 'express';
import path from 'path';


import authCtrl from '../auth/controller';
import response from '../../helpers/response-formatter/response-formatter';
import userCtrl from '../users/controller';


function init (app) {
    const router = express.Router();

    router.route('/')
        .get(response.load({ info: 'Successfully got index' }, 'index'), response.send);

    router.route('/register')
        .post(userCtrl.create, response.load({}, 'user/info'), response.send);

    router.route('/login')
        .post(authCtrl.signin, response.send);

    router.route('/user/:id')
        .get(userCtrl.load, response.send);

    router.route('/user/:id/update')
        .post(userCtrl.load, userCtrl.update, response.load({}, 'user/info'), response.send);

    router.route('/user/:id/password')
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

    /**
     * Load static files to serve on page
     */
    router.use('/css', express.static(path.resolve(app.get('root'), 'public/css')));
    router.use('/fonts', express.static(path.resolve(app.get('root'), 'public/fonts')));
    router.use('/images', express.static(path.resolve(app.get('root'), 'public/images')));
    router.use('/js', express.static(path.resolve(app.get('root'), 'public/js')));

    return router;
}

export default init;
