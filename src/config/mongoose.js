import mongoose from 'mongoose';
import Promise from 'bluebird';

import config from './env';


const debug = require('debug')('generic-server-app:index');

function init (app) {
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

    // Deals with node process ending
    process
        .on('SIGINT', closeConnection)
        .on('SIGTERM', closeConnection)
        .on('SIGHUP', closeConnection);

    // Set mongoose on express app
    if (app) {
        app.set('mongoose', mongoose);
    }

    return mongoose;
}

function closeConnection () {
    // Close mongoose connection
    mongoose.connection.close(() => {
        debug(`Closing connection to Mongo DB ${ config.db }`);
        process.exit(0);
    });
}

export default init;
