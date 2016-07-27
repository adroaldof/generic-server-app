import express from 'express';
import path from 'path';

import config from './config/env/index';

import { default as initDb } from './config/mongoose';
import { default as initModels } from './config/models';
import { default as initExpress } from './config/express';


const app = express();
const debug = require('debug')('generic-server-app:index');

/**
 * Set express app variables
 */
app.set('root', path.resolve(__dirname, '..'));
app.set('env', config.env);
app.set('config', config);


/**
 * Start system modules
 */
initDb(app);
initModels(app);
initExpress(app);


/**
 * Start app
 */
/* istanbul ignore next */
if (!module.parent) {
    app.listen(config.port, () => {
        debug(`Server started on port ${ config.port } (${ config.env })`);
    });
}

export default app;

