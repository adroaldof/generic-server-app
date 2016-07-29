/* istanbul ignore next */
import dotenv from 'dotenv';

dotenv.config({ silent: true });

export default {
    env: 'development',
    db: process.env.MONGODB_URI_DEV || 'mongodb://localhost/generic-server-app-dev',
    port: process.env.PORT || 3000,
    session: {
        secret: 's0m3VeRyN1c3S#cr3tHer34U'
    }
};

