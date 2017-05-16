import dotenv from 'dotenv';

dotenv.config({ silent: true });

export default {
  env: 'test',
  db: process.env.MONGODB_URI_TEST || 'mongodb://mongo-test:27018',
  port: process.env.PORT || 3002,
  session: {
    secret: 's0m3VeRyN1c3S#cr3tHer34U'
  }
};

