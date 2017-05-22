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
export async function hashPassword (password, salt) {
  if (typeof password === 'function') {
    return password(new APIError('Password as string is necessary as first parameter'), null);
  }

  if (!password && typeof salt === 'function') {
    return salt(new APIError('Password as string is necessary'), null);
  }

  const len = LEN / 2;

  if (password && salt && typeof salt === 'function') {
    console.log('-=-= 01');
    const generatedSalt = await generateToken(SALT_LEN / 2);
    console.log('-=-= 02');
    const passwordSalt = generatedSalt.toString('hex');
    console.log('passwordSalt', passwordSalt);

    console.log('====== crypto ==============');
    const derivedKey = await crypto.pbkdf2(password, passwordSalt, ITERATIONS, len, DIGEST);
    console.log('---- after');
    console.log('derivedKey', derivedKey);
    const derivedKeyString = derivedKey.toString('hex');

    console.log('********************', ' derivedKeyString ', '********************');
    console.log('derivedKeyString', derivedKeyString);
    return derivedKeyString;
  }

  if (password && salt) {
    console.log('====================');
    const derivedKey = await crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST);
    console.log('derivedKey', derivedKey);
    const derivedKeyString = derivedKey.toString('hex');

    console.log('********************', ' derivedKeyString ', '********************');
    console.log('derivedKeyString', derivedKeyString);
    return derivedKeyString;
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
export async function verify (toCheckPassword, userHashPassword, userPasswordSalt) {
  console.log('==================');
  console.log('==================');
  console.log('toCheckPassword, userHashPassword, userPasswordSalt', toCheckPassword, userHashPassword, userPasswordSalt);
  console.log('==================');
  console.log('==================');
  const hashedPassword = await hashPassword(toCheckPassword, userPasswordSalt);

  return hashedPassword === userHashPassword;
}

