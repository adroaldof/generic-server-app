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
    .post(validate(validator.createUser), userCtrl.create);

/**
 * Route to an spacific user
 *
 * {GET/PUT/DELETE} /api/users/:userId
 */
router.route('/:userId')
    .get(userCtrl.get)
    .put(validate(validator.updateUser), userCtrl.update)
    .delete(userCtrl.remove);

// Load user when API with userId route parameter is hit
router.param('userId', userCtrl.load);

export default router;

