import dotenv from 'dotenv';

dotenv.config({ silent: true });

export default {
    env: 'test',
    db: process.env.MONGODB_URI_TEST || 'mongodb://localhost/generic-server-app-test',
    port: 3000,
    session: {
        secret: 's0m3VeRyN1c3S#cr3tHer34U'
    }
};

