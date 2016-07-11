import User from './users.model';

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
    const userData = {
        name: req.body.name,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        password: req.body.password
    };

    user.register(userData)
        .then((savedUser) => res.json(savedUser))
        .error((error) => next(error));
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

    User.get(userId)
        .then((user) => {
            req.resources.user = user;
            return next();
        })
        .error((error) => {
            next(error);
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
    const user = req.user;

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

    req.resources = req.resources || {};
    _.assign(user, req.body);

    user.saveAsync()
        .then((updatedUser) => {
            req.resources.user = updatedUser;
            return next();
        })
        .error((error) => next(error));
}


export default {load, create, update, list, remove};

