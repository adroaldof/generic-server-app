import crypto from 'crypto';

import APIError from '../errors/APIError';
import generateToken from '../token/token';


const LEN = 256;
const SALT_LEN = 64;
const ITERATIONS = 10000;
const DIGEST = 'sha256';


/**
 * Creates a hash based on a salt from a given password
 * if there is no salt a new salt will be generated
 *
 * @apiParam {String} password
 * @apiparam {String} salt - optional
 * @apiparam {Function} callback
 */
function hashPassword (password, salt, callback) {
    const len = LEN / 2;

    if (password && callback && typeof callback === 'function') {
        return crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST,
            (err, derivedKey) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, derivedKey.toString('hex'));
            });
    }

    if (password && salt && typeof salt === 'function') {
        // If no salt is supplied get second parameter as callback
        const cb = salt;

        return generateToken(SALT_LEN / 2, (err, generatedSalt) => {
            if (err) {
                return cb(err);
            }

            const passwordSalt = generatedSalt.toString('hex');

            return crypto.pbkdf2(password, passwordSalt, ITERATIONS, len, DIGEST,
                (error, derivedKey) => {
                    if (error) {
                        return cb(error);
                    }

                    return cb(null, derivedKey.toString('hex'), passwordSalt);
                });
        });
    }

    if (typeof password === 'function') {
        return password(new APIError('Password as string is necessary as first parameter'), null);
    }

    if (!password && typeof salt === 'function') {
        return salt(new APIError('Password as string is necessary'), null);
    }

    return new APIError('Check parameters: passwordString, [passwordSaltString,] callbackFunction');
}

/**
 * Verifies if a password matches a hash by hashing the password
 * with a given salt
 *
 * @apiParam {String} toCheckPassword
 * @apiparam {String} userHashPassword
 * @apiparam {String} userPasswordSalt
 * @apiparam {Function} callback
 */
function verify (toCheckPassword, userHashPassword, userPasswordSalt, cb) {
    return hashPassword(toCheckPassword, userPasswordSalt, (err, hashedPassword) => {
        if (err) {
            return cb(err);
        }

        if (hashedPassword === userHashPassword) {
            return cb(null, true);
        }

        return cb(null, false);
    });
}

export default { hashPassword, verify };
