import crypto from 'crypto';

const LEN = 16;

function generateToken (randomBytes, callback) {
    if (typeof randomBytes === 'function') {
        callback = randomBytes;
        randomBytes = LEN;
    }

    randomBytes = randomBytes / 2;

    crypto.randomBytes(randomBytes, (err, buffer) => {
        if (err) {
            return callback(err);
        }

        const token = buffer.toString('hex');

        callback(null, token);
    });
}

export default generateToken;

