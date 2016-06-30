import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressValidation from 'express-validation';
import expressWinston from 'express-winston';
import httpStatus from 'http-status';
import logger from 'morgan';
import methodOverride from 'method-override';

import APIError from '../helpers/APIError';
import config from './env';
import routes from '../api/routes';
import winstonInstance from './winston';


const app = express();

// Parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Other configurations
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// Disable 'X-Powered-By' header in response
app.disable('x-powered-by');

// Mount all routes on /api path
app.use('/api', routes);

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


// Export Express app
export default app;

