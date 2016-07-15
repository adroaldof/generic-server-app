import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import _ from 'lodash';

import passwordHelper from '../../helpers/password';
import APIError from '../../helpers/errors/APIError';


const UserSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    mobileNumber: {type: String},
    password: {type: String, required: true, select: false},
    passwordSalt: {type: String, required: true, select: false}
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

        if (!data.password) {
            const err = new APIError('Password must be supplied', httpStatus.NOT_FOUND);

            return callback(err, null);
        }

        passwordHelper.hashPassword(opts.password, (err, hashedPassword, salt) => {
            if (err) {
                return callback(err);
            }

            data.password = hashedPassword;
            data.passwordSalt = salt;

            self.create(data, (err, user) => {
                if (err) {
                    return callback(err, null);
                }

                user.password = undefined;
                user.passwordSalt = undefined;

                callback(err, user);
            });
        });
    },


    /**
     * Authenticate a user
     *
     * @apiParam {String} email User email
     * @apiParam {String} password User password
     * @apiParam {Function} callback Callback function
     */
    authenticate (email, password, callback) {
        this.findOne({ email: email})
            .select('+password +passwordSalt')
            .exec((err, user) => {
                if (err) {
                    return callback(err);
                }

                // Case no user return an empty user
                if (!user) {
                    return callback(err, user);
                }

                // Verify password with existing hash from user
                passwordHelper.verify(password, user.password, user.passwordSalt, (err, result) => {
                    if (err) {
                        return callback(err, null);
                    }

                    // If password does not match don't return use
                    if (result === false) {
                        return callback(err, null);
                    }

                    // Remove password and salt from result
                    user.password = undefined;
                    user.passwordSalt = undefined;

                    callback(err, user);
                });
            });
    },


    /**
     * Retrieve an user information
     *
     * @apiParam {ObjectId} id The ObjectId referent to user identification
     * @apiSuccess {Promise<User, APIError>} Returns a promise with the user information or an error
     */
    changePassword (id, oldPassword, newPassword, callback) {
        const self = this;

        self.findById({ _id: id })
            .select('+password +passwordSalt')
            .exec((err, user) => {
                if (err) {
                    return callback(err, null);
                }

                if (!user) {
                    return callback(err, user);
                }

                passwordHelper.verify(oldPassword, user.password, user.passwordSalt, (err, result) => {
                    if (err) {
                        return callback(err, null);
                    }

                    if (!result) {
                        const PassNoMatchError = new Error('Old password does not match');
                        PassNoMatchError.type = 'old_password_does_not_match';
                        return callback(PassNoMatchError, null);
                    }

                    passwordHelper.hashPassword(newPassword, (err, hashedPassword, salt) => {
                        user.password = hashedPassword;
                        user.passwordSalt = salt;

                        user.save((err) => {
                            if (err) {
                                return callback(err, null);
                            }

                            if (callback) {
                                return callback(err, {
                                    success: true,
                                    message: 'Password change succefully'
                                });
                            }
                        });
                    });
                });
            });
    },


    /**
     * Retrieve an user information
     *
     * @apiParam {ObjectId} id The ObjectId referent to user identification
     * @apiSuccess {Promise<User, APIError>} Returns a promise with the user information or an error
     */
    get (id, callback) {
        const err = new APIError('No such user found!', httpStatus.NOT_FOUND);

        this.findById({ _id: id })
            .execAsync()
            .then((user) => {
                if (user) {
                    return callback(null, user);
                }

                return callback(err, null);
            }, (err) => {
                return callback(err, null);
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

