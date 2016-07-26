import express from 'express';
import path from 'path';

import authRoutes from '../api/auth/index';
import coreRoutes from '../api/core/index';
import userRoutes from '../api/users/index';

function init (app) {
    const router = express.Router(); // eslint-disable-line new-cap

    /**
     * App routes
     */
    router.use('/auth', authRoutes);
    router.use('/core', coreRoutes);
    router.use('/users', userRoutes);

    /**
     * General static routes
     */
    router.use('/coverage', express.static(path.resolve(app.get('root'), 'coverage/lcov-report')));
    router.use('/docs', express.static(path.resolve(app.get('root'), 'docs/api')));
    router.use('/documentation', express.static(path.resolve(app.get('root'), 'docs/doc')));
    router.use('/public', express.static(path.resolve(app.get('root'), 'public')));

    return router;
}


export default init;

