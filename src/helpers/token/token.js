import crypto from 'crypto';

const LEN = 16;

function generateToken (randomBytes, callback) {
    let randomBytesSize = randomBytes;

    if (!randomBytes || randomBytesSize === null || typeof randomBytesSize !== 'number') {
        randomBytesSize = LEN;
    }

    randomBytesSize = randomBytesSize / 2;

    crypto.randomBytes(randomBytesSize, (err, buffer) => {
        if (err) {
            return callback(err);
        }

        const token = buffer.toString('hex');

        return callback(null, token);
    });
}

export default generateToken;

