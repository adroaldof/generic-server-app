import crypto from 'crypto';

const bytesSize = 16;

export default function generateToken (randomBytes) {
  let randomBytesSize = randomBytes;

  if (!randomBytesSize || typeof randomBytesSize !== 'number') {
    randomBytesSize = bytesSize;
  }

  randomBytesSize = randomBytesSize / 2;

  const buffer = crypto.randomBytes(randomBytesSize);
  console.log('*************** token ***********************');
  console.log('buffer', buffer);
  const token = buffer.toString('hex');
  console.log('token', token);
  console.log('*************** token ***********************');

  return token;
}

