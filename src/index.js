'use strict';

import mongoose from 'mongoose';
import Promise from 'bluebird';

import app from './config/express';
import config from './config/env';


const debug = require('debug')('generic-server-app:index');


// Promisify mongoose
Promise.promisifyAll(mongoose);


// Connect to mongo db
mongoose.connect(config.db, {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
});


// Deal with mongoose connections
/* istanbul ignore next */
mongoose.connection
    .on('connected', () => {
        debug(`Connected to Mongo DB ${ config.db }`);
    })
    .on('disconnected', () => {
        debug(`Disconnected to Mongo DB ${ config.db }`);
    })
    .on('error', () => {
        debug(`Unable to connect to database ${ config.db }`);
    });


app.listen(config.port, () => {
    debug(`Server started on port ${ config.port } (${ config.env })`);
});

export default app;

