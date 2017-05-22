/* eslint-disable no-param-reassign */

import _ from 'lodash';
import passport from 'passport';

/**
 * @api {POST} /api/{version}/auth/ Sign in an user
 * @apiName Signin
 * @apiGroup Authentication
 *
 * @apiSuccess {Object} data Returns a logged user
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 Found
 *   {
 *      data: {
 *        user: {
 *          _id: '578f947b57ad33a843b7eda2',
 *          name: 'John Doe',
 *          email: 'john-doe@gmail.com'
 *        }
 *      },
 *      info: 'Successfully logged in',
 *      status: 200,
 *      page: '/user/578f947b57ad33a843b7eda2',
 *      shouldRedirect: true
 *   }
 *
 * @apiError UserNotFound User not found
 *
 * @apiErrorExample Error-Response:
 *   HTTP/1.1 404 Not Found
 *   {
 *      data: {
 *        err: 'User not found',
 *        status: 404
 *      },
 *      page: '/'
 *   }
 */

function signin (req, res, next) {
  req.resources = req.resources || {};

  passport.authenticate('local', { failureRedirect: '/' }, (err, user, info) => {
    if (err || !user) {
      _.assign(req.resources, {
        data: { err: err || 'No user found' },
        page: '/'
      });

      return next();
    }

    return req.logIn(user, () => {
      _.assign(req.resources, {
        data: { user },
        info,
        page: String('/user/').concat(user._id), // eslint-disable-line no-underscore-dangle
        shouldRedirect: true
      });

      return next();
    });
  })(req, res, next);
}


/**
 * @api {GET} /api/{version}/logout Logout an user
 * @apiName Signout
 * @apiGroup Authentication
 *
 * @apiSuccess {Object} data Logout message
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 Found
 *   {
 *      info: 'Successfully logged out',
 *      status: 200,
 *      shouldRedirect: true
 *   }
 */

function signout (req, res, next) {
  req.resources = req.resources || {};

  req.logout();

  _.assign(req.resources, {
    info: 'Successfully logged out',
    shouldRedirect: true
  });

  return next();
}

export default { signin, signout };
