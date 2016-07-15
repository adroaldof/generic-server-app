import crypto from 'crypto';


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

    if (arguments.length === 3) {
        crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, (err, derivedKey) => {
            if (err) {
                return callback(err);
            }

            return callback(null, derivedKey.toString('hex'));
        });
    } else {
        // If no salt is supplied get second parameter as callback
        callback = salt;

        crypto.randomBytes(SALT_LEN / 2, (err, salt) => {
            if (err) {
                return callback(err);
            }

            salt = salt.toString('hex');

            crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, (err, derivedKey) => {
                if (err) {
                    return callback(err);
                }

                callback(null, derivedKey.toString('hex'), salt);
            });
        });
    }
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
    hashPassword(toCheckPassword, userPasswordSalt, (err, hashedPassword) => {
        if (err) {
            return cb(err);
        }

        if (hashedPassword === userHashPassword) {
            cb(null, true);
        } else {
            cb(null, false);
        }

    });
}

export default { hashPassword, verify };
