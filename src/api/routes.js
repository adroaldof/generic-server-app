import express from 'express';
import path from 'path';

import coreRoutes from './core/core.index';
import userRoutes from './users/users.index';


const router = express.Router();

/**
 * App routes
 */
router.use('/core', coreRoutes);
router.use('/users', userRoutes);

/**
 * Util pages routes
 */
router.use('/coverage', express.static(path.resolve(__dirname, '../../coverage/lcov-report')));
router.use('/docs', express.static(path.resolve(__dirname, '../../docs/api')));
router.use('/documentation', express.static(path.resolve(__dirname, '../../docs/doc')));

router.use('/public', express.static(path.resolve(__dirname, '../../public')));

export default router;

