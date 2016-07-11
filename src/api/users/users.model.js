import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import _ from 'lodash';

import APIError from '../../helpers/APIError';
import passwordHelper from '../../helpers/password';


const UserSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    passwordSalt: {type: String, required: true, select: false},
    mobileNumber: {type: String}
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
     * Crete a new user
     *
     * @apiParam {Object} opts User data
     * @apiParam {Function} callback Callback function
     */
    register (opts, callback) {
        const self = this;
        const data = _.cloneDeep(opts);

        passwordHelper.hashPassword(opts.password, (err, hashedPassword, salt) => {
            if (err) {
                return callback(err);
            }

            data.password = hashedPassword;
            data.passwordSalt = salt;

            self.model('User').create(data, (err, user) => {
                if (err) {
                    return callback(err, null);
                }

                user.password = undefined;
                user.passwordSalt = undefined;

                callback(err, user);
            });
        });
    },


     * Retrieve an user information
     *
     * @apiParam {ObjectId} id The ObjectId referent to user identification
     * @apiSuccess {Promise<User, APIError>} Returns a promise with the user information or an error
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
     * @apiParam {Number} skip Number of users to be skipped
     * @apiParam {Number} limit Limit number or users to be returned
     * @apiSuccess {Promise<User[]>} Returns an array of users objects
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

