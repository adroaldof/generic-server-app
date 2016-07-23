import express from 'express';
import validate from 'express-validation';

import userCtrl from './controller';
import response from '../../helpers/response-formatter/response-formatter';
import validator from './validator';


const router = express.Router();

router.route('/')
    .get(userCtrl.list, response.send)
    .post(validate(validator.createUser), userCtrl.create, response.load({}, 'user/info'), response.send);

router.route('/:id')
    .get(userCtrl.load, response.send);

router.route('/:id/update')
    .put(validate(validator.updateUser), userCtrl.load, userCtrl.update, response.send);

router.route('/:id/password')
    .put(userCtrl.load, userCtrl.changePassword, response.send);

router.route('/:id/remove')
    .delete(userCtrl.load, userCtrl.remove, response.send);

// Load user when API with userId route parameter is hit
// router.param('userId', userCtrl.load);

export default router;

