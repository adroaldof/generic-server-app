import express from 'express';
import validate from 'express-validation';

import userCtrl from './users.controller';
import validator from './users.validator';


const router = express.Router();

/**
 * Main user route
 *
 * {GET/POST} /api/users
 */
router.route('/')
    .get(userCtrl.list)
    .post(userCtrl.create);


/**
 * Route to an spacific user
 *
 * {GET/PUT/DELETE} /api/users/:userId
 */
router.route('/:userId')
    .get(userCtrl.get)
    .put(userCtrl.load, userCtrl.update)
    .delete(userCtrl.load, userCtrl.remove);

/**
 * Route to an spacific user
 *
 * {PUT} /api/users/:userId/change-password
 */
router.route('/:userId/change-password')
    .put(userCtrl.load, userCtrl.changePassword);

// Load user when API with userId route parameter is hit
// router.param('userId', userCtrl.load);

export default router;

