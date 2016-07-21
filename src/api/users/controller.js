import User from './model';
import _ from 'lodash';

/**
 * @api {POST} /api/{version}/user Create a new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiPermission public
 *
 * @apiParam {String} req.body.name name of user
 * @apiParam {String} req.body.mobileNumber Mobile phone number
 *
 * @apiSuccess {User} user Returns the created user
 * @apiError {Object} error Error message
 */
function create (req, res, next) {
    const userData = _.pick(req.body, ['name', 'email', 'password', 'mobileNumber']);
    req.resources = req.resources || { data: {} };

    User.register(userData, (err, user) => {
        if (err) {
            req.resources.data = { err: err };
            return next();
        }

        req.logIn(user, (err) => {
            if (err) {
                req.resources.data = { err: err };
                return next();
            }

            req.resources.data.user = user;
            req.resources.shoudRedirect = true;
            return next();
        });
    });
}


/**
 * @api {GET} /api/{version}/user/ List users
 * @apiName ListUser
 * @apiGroup User
 *
 * @apiParam {Number} skip Number of users to be skipped
 * @apiParam {Number} limit Limit of users to be returned
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *
 * @apiSuccess {User[]} users List of user
 * @apiError {Object} error Error message
 */
function list (req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    req.resources = req.resources || { data: {} };

    User.list({ limit, skip })
        .then((users) => {
            req.resources.data = { users: users };
            req.resources.info = 'Got users list';

            return next();
        })
        .error((err) => {
            req.resources.data = { err: err };

            return next();
        });
}


/**
 * @api {GET} /api/{version}/user/:id Get an user and append to resources on request object
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id ObjectId corresponding to and specific user
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *
 * @apiSuccess {User} user Returns an user
 * @apiError {Object} error Error message
 */
function get (req, res, next) {
    const userId = req.params.userId;
    req.resources = req.resources || { data: {} };

    User.get(userId, (err, user) => {
        if (err) {
            req.resources.data = { err: err };

            return next();
        }

        req.resources.data = { users: users };
        req.resources.info = 'Got users list';

        return next();
    });
}


/**
 * @api {GET} /api/{version}/user/:id Load an user and append to resources on request object
 * @apiName LoadUser
 * @apiGroup User
 *
 * @apiParam {ObjectId} id ObjectId corresponding to and specific user
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *
 * @apiSuccess {User} user Returns an user
 * @apiError {Object} error Error message
 */
function load (req, res, next) {
    const userId = req.params.id;
    req.resources = req.resources || {};

    User.get(userId, (err, user) => {
        if (err) {
            _.assign(req.resources, {
                data: { err: err }
            });

            return next(err);
        }

        _.assign(req.resources, {
            data: { user: user },
            page: 'user/info'
        });

        return next();
    });
}


/**
 * @api {DELETE} /api/{version}/user/:id Remove one user from system
 * @apiName RemoveUser
 * @apiGroup User
 *
 * @apiParam {User} user User to be removed
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *
 * @apiSuccess {User} user Returns the deleted user
 * @apiError {Object} error Error message
 */
function remove (req, res, next) {
    const user = req.resources.data.user;

    user.removeAsync()
        .then((removedUser) => {
            _.unset(req.resources, 'data.user');
            _.assign(req.resources, {
                info: {
                    success: true,
                    message: 'User removed successfully'
                },
                shouldRedirect: true
            });

            return next();
        })
        .error((err) => {
            req.resources.data = { err: err };

            return next();
        });
}


/**
 * @api {PUT} /api/{version}/user/:id Update an existing user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} name name of user
 * @apiParam {String} mobileNumber Mobile phone number
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *
 * @apiSuccess {User} user Returns the saved user
 * @apiError {Object} error Error message
 */
function update (req, res, next) {
    const user = req.resources.data.user;

    _.assign(user, req.body);

    user.saveAsync()
        .then((updateUser) => {
            req.resources.data.user = updateUser
            return next();
        })
        .error((err) => {
            req.resources.data = { err: err };
            return next();
        });
}


/**
 * @api {PUT} /api/{version}/user/:id Change password of an existing user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} name name of user
 * @apiParam {String} mobileNumber Mobile phone number
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *
 * @apiSuccess {User} user Returns the saved user
 * @apiError {Object} error Error message
 */
function changePassword (req, res, next) {
    const user = req.resources.data.user;
    const info = req.body;

    req.resources = req.resources || {};

    User.changePassword(user._id, info.password, info.newPassword, (err, changedInfo) => {
        if (err) {
            req.resources.data = { err: err };
            return next();
        }

        req.resources.info = changedInfo;
        req.resources.shoudRedirect = true;
        return next();
    });
}


export default {load, create, get, update, changePassword, list, remove};
