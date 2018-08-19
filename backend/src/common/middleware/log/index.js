const log4js = require('log4js');
const LOGS_PATH = require('../../../config').LOGS_PATH;

log4js.configure({
    appenders: {
        console: { type: 'console' },
        info: {  type: 'file', filename: `${LOGS_PATH}/info.log` },
        error: {  type: 'file', filename: `${LOGS_PATH}/error.log` },
        'just-errors': { type: 'logLevelFilter', appender: 'error', level: 'error' },
        'just-except-errors': { type: 'logLevelFilter', appender: 'info', level: 'all', maxLevel: 'warn' }
    },
    categories: {
        default: { appenders: ['console', 'just-errors', 'just-except-errors'], level: 'all' }
    }
});

const logger = log4js.getLogger('default');
console.log = logger.info.bind(logger);
console.error = logger.error.bind(logger);
console.warn = logger.warn.bind(logger);

console.log(`log files path:`, LOGS_PATH)

module.exports = log4js.connectLogger(logger);
