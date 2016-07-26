import dotenv from 'dotenv';

dotenv.config();

export default {
    env: 'production',
    db: process.env.MONGODB_URI || 'mongodb://localhost/generic-server-app-prod',
    port: 3000,
    session: {
        secret: 's0m3VeRyN1c3S#cr3tHer34U'
    }
};

