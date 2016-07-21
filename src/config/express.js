import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import session from 'express-session';
import expressValidation from 'express-validation';
import expressValidator from 'express-validator';
import expressWinston from 'express-winston';
import httpStatus from 'http-status';
import logger from 'morgan';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';

import APIError from '../helpers/errors/APIError';
import config from './env';
import winstonInstance from './winston';
import localStrategy from './strategies/local';

import { default as core } from '../api/core/index';
import { default as routes } from './routes';


function init (app) {
    // import MongoStore from 'connect-mongo';
    const User = mongoose.model('User');
    const MongoStore = require('connect-mongo')(session);
    const sessionOpts = {
        secret: config.session.secret,
        key: 'skey.sid',
        resave: false,
        saveUninitialized: false
    };

    // View engine setup
    app.set('views', path.resolve(__dirname, '../../views/'));
    app.set('view engine', 'jade');

    app.set('trust proxy');
    app.use(expressValidator());

    // Parse body params and attach them to req.body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    // Other configurations
    app.use(compress());
    app.use(methodOverride());

    // Disable 'X-Powered-By' header in response
    app.disable('x-powered-by');

    // Deal with sessions
    sessionOpts.store = new MongoStore({
        url: config.db
    });

    app.use(session(sessionOpts));

    // Deal with passport
    app.use(passport.initialize());
    app.use(passport.session());
    localStrategy(passport);

    /* istanbul ignore next */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    /* istanbul ignore next */
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // Mount static files on root
    app.use('/', core(app));

    // Mount all api routes on /api path
    app.use('/api', routes(app));

    // Enable detailed API loggin when environment is development
    /* istanbul ignore next */
    if (config.env === 'dev') {
        expressWinston.requestWhitelist.push('body');
        expressWinston.responseWhitelist.push('body');

        app.use(logger('dev'));
        app.use(expressWinston.logger({
            winstonInstance,
            meta: true,
            msg: 'HTTP {{ req.method }} {{ req.url }} {{ res.statusCode }} {{ res.responseTime }}ms',
            colorsStatus: true
        }));
    }

    // Log error in winston transports except when executing test suite
    /* istanbul ignore next */
    if (config.env !== 'test') {
        app.use(expressWinston.errorLogger({
            winstonInstance
        }));
    }

    // If error is not an instanceOf APIError, convert it
    /* istanbul ignore next */
    app.use((err, req, res, next) => {
        if (err instanceof expressValidation.ValidationError) {
            const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
            const error = new APIError(unifiedErrorMessage, err.status, true);

            return next(error);
        } else

            if (!(err instanceof APIError)) {
                const apiError = new APIError(err.message, err.status, err.isPublic);

                return next(apiError);
            }

            return next(err);
    });

    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new APIError('API not found', httpStatus.NOT_FOUND);

        return next(err);
    });

    // Error handler, send stacktrace only during development
    /* jscs: disable */
    app.use((err, req, res, next) => {
        res.status(err.status)
            .json({
                message: (err.isPublic) ? err.message : httpStatus[err.status],
                stack: (config.env === 'dev') ? err.stack : {}
            });
    });
    /* jscs: enable */
}


// Export Express app
export default init;

