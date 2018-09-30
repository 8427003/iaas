const LOGS_PATH = 'logs';
const DB_CONFIG = {
    host: '39.106.189.173',
    user: 'root',
    password : 'root',
    database : 'docker'
}
const SERVER_PORT = '3001';

const SSO = {
    appid: 'mNdQ14bOA',
    appsecret: '3d3f10b6e886c27b095afc2bc958113b',
    baseURL: 'http://127.0.0.1:3000',
}

// redis配置
const REDIS_CONFIG = {
    host: '39.106.189.173',
    port: 6379,
}

const APP = 'iass';

module.exports = {
    SSO,
    LOGS_PATH,
    DB_CONFIG,
    SERVER_PORT,
    REDIS_CONFIG,
    APP
}
