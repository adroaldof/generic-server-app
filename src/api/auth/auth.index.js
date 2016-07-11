import express from 'express';

import authController from './auth.controller';


const router = express.Router();

router.route('/')
    .get(authController.signout)
    .post(authController.signin);

export default router;
