const profile = process.env.PROFILE;
let config = null;

switch(profile) {
    case 'dev': config = require('./dev'); break;
    case 'test': config = require('./test'); break;
    case 'prod': config = require('./prod'); break;
    default: config = require('./prod');
}

module.exports = config;
