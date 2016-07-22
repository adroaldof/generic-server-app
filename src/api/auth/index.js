import express from 'express';

import authController from './controller';
import response from '../../helpers/response-formatter/response-formatter';


const router = express.Router();

router.route('/')
    .get(authController.signout, response.load({}, '/'), response.send)
    .post(authController.signin, response.send);

export default router;
