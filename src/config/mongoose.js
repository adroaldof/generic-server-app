import mongoose from 'mongoose';
import Promise from 'bluebird';

import config from './env/index';


const debug = require('debug')('generic-server-app:index');

function closeConnection () {
  // Close mongoose connection
  /* istanbul ignore next */
  mongoose.connection.close(() => {
    debug(`Closing connection to Mongo DB ${ config.db }`);
    process.exit(0);
  });
}

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

export default init;

