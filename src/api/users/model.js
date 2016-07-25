import httpStatus from 'http-status';
import mongoose from 'mongoose';
import _ from 'lodash';

import APIError from '../../helpers/errors/APIError';
import passwordHelper from '../../helpers/password/password';


const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String },
    password: { type: String, required: true, select: false },
    passwordSalt: { type: String, required: true, select: false }
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

        return passwordHelper.hashPassword(opts.password, (error, hashedPassword, salt) => {
            if (error) {
                return callback(error);
            }

            data.password = hashedPassword;
            data.passwordSalt = salt;

            return self.create(data, (err, user) => {
                if (err) {
                    return callback(err, null);
                }
                const savedUser = user;

                savedUser.password = undefined;
                savedUser.passwordSalt = undefined;

                return callback(err, savedUser);
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
        const self = this;

        return self.findOne({ email })
            .select('+password +passwordSalt')
            .exec((err, user) => {
                if (err) {
                    return callback(err);
                }

                // Case no user return an empty user
                if (!user) {
                    return callback(err, user);
                }

                const authenticatedUser = user;

                // Verify password with existing hash from user
                return passwordHelper.verify(password, user.password, user.passwordSalt,
                    (error, result) => {
                        if (error) {
                            return callback(err, null);
                        }

                        // If password does not match don't return use
                        if (result === false) {
                            return callback(err, null);
                        }

                        // Remove password and salt from result
                        authenticatedUser.password = undefined;
                        authenticatedUser.passwordSalt = undefined;

                        return callback(err, authenticatedUser);
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

        return self.findById({ _id: id })
            .select('+password +passwordSalt')
            .exec((err, user) => {
                if (err) {
                    return callback(err, null);
                }

                if (!user) {
                    return callback(err, user);
                }

                const anUser = user;

                return passwordHelper.verify(oldPassword, anUser.password, anUser.passwordSalt,
                    (err, result) => { // eslint-disable-line no-shadow
                        if (err) {
                            return callback(err, null);
                        }

                        if (!result) {
                            const PassNoMatchError = new Error('Old password does not match');
                            PassNoMatchError.type = 'old_password_does_not_match';

                            return callback(PassNoMatchError, null);
                        }

                        return passwordHelper.hashPassword(newPassword,
                            (err, hashedPass, salt) => { // eslint-disable-line no-shadow
                                anUser.password = hashedPass;
                                anUser.passwordSalt = salt;

                                return anUser.save((err) => { // eslint-disable-line no-shadow
                                    if (err) {
                                        return callback(err, null);
                                    }

                                    return callback(err, {
                                        success: true,
                                        message: 'Password changed successfully'
                                    });
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
        const notFound = new APIError('No such user found!', httpStatus.NOT_FOUND);

        return this.findById({ _id: id })
            .execAsync()
            .then((user) => {
                if (!user) {
                    return callback(notFound, null);
                }

                return callback(null, user);
            })
            .catch(err => callback(err, null));
    },


    /**
     * List users in descending order of 'createdAt' timestamp
     *
     * @apiParam {Number} skip Number of users to be skipped
     * @apiParam {Number} limit Limit number or users to be returned
     * @apiSuccess {Promise<User[]>} Returns an array of users objects
     */
    list ({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
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

