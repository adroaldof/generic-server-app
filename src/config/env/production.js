/* istanbul ignore next */
import dotenv from 'dotenv';

dotenv.config({ silent: true });

export default {
  env: 'production',
  db: process.env.MONGODB_URI || 'mongodb://mongo:27017',
  port: process.env.PORT || 3000,
  session: {
    secret: 's0m3VeRyN1c3S#cr3tHer34U'
  }
};

