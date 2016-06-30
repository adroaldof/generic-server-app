import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Promise from 'bluebird';

import APIError from '../../helpers/APIError';


const UserSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^[1-9][0-9]{8,15}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
    }
}, {
    timestamps: true
});

/**
 * Improve User
 * - Pre-save hooks
 * - Validations
 * - Virtuals
 */

// UserSchema.methods({});


UserSchema.statics = {
    /**
     * Retrieve an user information
     *
     * @access public
     * @param {ObjectId} id The ObjectId referent to user identification
     * @returns {Promise<User, APIError>} Returns a promise with the user information or an error
     */
    get (id) {
        const err = new APIError('No such user found!', httpStatus.NOT_FOUND);

        return this.findById(id).execAsync()
            .then((user) => {
                if (user) {
                    return user;
                }

                return Promise.reject(err);
            }, (err) => {
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp
     *
     * @access public
     * @param {Number} skip Number of users to be skipped
     * @param {Number} limit Limit number or users to be returned
     * @returns {Promise<User[]>} Returns an array of users objects
     */
    list ({skip = 0, limit = 50} = {}) {
        return this.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .execAsync();
    }
};

/**
 * User
 *
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

