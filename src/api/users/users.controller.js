import User from './users.model';
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

    User.register(userData, (err, user) => {
        if (err) {
            return next(err);
        }

        res.json(user);
        next();
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
    const {limit = 50, skip = 0} = req.query;

    User.list({limit, skip})
        .then((users) => res.json(users))
        .error((error) => next(error));
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
    req.resources = req.resources || {};

    User.get(userId, (err, user) => {
        if (err) {
            return next(err);
        }

        res.json(user);
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
    const user = req.resources.user;

    user.removeAsync()
        .then((deletedUser) => res.json(deletedUser))
        .error((error) => next(error));
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
    const user = req.resources.user;

    _.assign(user, req.body);

    user.saveAsync()
        .then((updatedUser) => res.json(updatedUser))
        .error((error) => next(error));
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
    const user = req.resources.user;
    const info = req.body;

    req.resources = req.resources || {};

    User.changePassword(user._id, info.password, info.newPassword, (err, changedInfo) => {
        if (err) {
            return next(err);
        }

        req.resources.info = changedInfo;
        res.send(changedInfo);
    });
}


export default {load, create, get, update, changePassword, list, remove};

