import _ from 'lodash';
import path from 'path';


const env = process.env.NODE_ENV || 'dev';
const config = require(`./${ env }`);
const defaults = {
    root: path.join(__dirname, '/..'),
    app: {
        name: 'Generic Server App'
    }
};

_.assign(config, defaults);

export default config;
