import _ from 'lodash';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();


const env = process.env.NODE_ENV || 'development';
const config = require(`./${ env }`);
const defaults = {
    root: path.join(__dirname, '/..'),
    app: {
        name: 'Generic Server App'
    }
};

_.assign(config, defaults);

export default config;
