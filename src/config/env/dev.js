import dotenv from 'dotenv';

dotenv.config();

export default {
    env: 'dev',
    db: process.env.MONGODB_URI_DEV || 'mongodb://localhost/generic-server-app-dev',
    port: 3000,
    session: {
        secret: 's0m3VeRyN1c3S#cr3tHer34U'
    }
};

