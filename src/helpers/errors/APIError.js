/* exported APIError */

import httpStatus from 'http-status';


/**
 * Extend default JS error handler
 */
class ExtendableError extends Error {
    /**
     * Error API constructor
     *
     * @param {String} message Error message
     * @param {Number} status HTTP status code number error
     * @param {Boolean} isPublic Whether error message should be visible or not to the user
     */
    constructor (message, status, isPublic) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;
        this.info = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true; // Bluebird 4 does't append it anymore

        Error.captureStackTrace(this, this.constructor.name);
    }
}


/**
 * Class representing an Error API
 */
class APIError extends ExtendableError {
    /**
     * Error API constructor
     *
     * @param {String} message Error message
     * @param {Number} status HTTP status code number error
     * @param {Boolean} isPublic Whether error message should be visible or not to the user
     */
    constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
        super(message, status, isPublic);
    }
}

export default APIError;
