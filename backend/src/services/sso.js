const resultWrap = require('../common/utils/resultWrap');
const request = require('request-promise-native');
const redisConnect = require('../common/helper/redisConnect');
const { baseURL, appid, appsecret } = require('../config').SSO
const APP = require('../config').APP
const PREFIX = `${APP}_sso_`
const LOGIN_TOKEN_COOKIE_NAME = '_ty_sso_token';

async function checkLogin(req, res,  next) {
    const loginToken = req.headers['Authorization'] || req.cookies[LOGIN_TOKEN_COOKIE_NAME];
    if(!loginToken) {
        return res.status(200).json(resultWrap(null, { code: 401, msg: '请先登录!' }));
    }
    try {
        const accessToken = await getAccessToken();
        const session = await getSession({loginToken, accessToken});

        if(!accessToken || !session) {
            throw Error("401 登录失败！");
        }
        req.accessToken = accessToken;
        req.session = session;
        next();
    }
    catch(e) {
        console.error('checkLogin', e);
        return res.status(200).json(resultWrap(null, { code: 401, msg: '获取登录信息失败, 请重新登录' }));
    }
}

async function getSession({ loginToken, accessToken }) {
    if(!loginToken || !accessToken) {
        throw Error('loginToken, accessToken both required !');
    }
    const url = `${baseURL}/api/open/getSession?accessToken=${accessToken}&loginToken=${loginToken}`;

    console.log('request', url)
    const res = await request(url, {'json': true} );
    console.log('request', url, 'return:', res)

    if(0 === res.errorCode && res.data) {
        return res.data;
    }
    throw Error('获取session失败！', res.errorMsg);
}

async function getAccessToken() {
    const accessTokenFromCache = await _getAccessTokenFromCache();
    if(accessTokenFromCache) {
        return accessTokenFromCache;
    }

    const url  = `${baseURL}/api/open/getAccessToken`;
    let res = await request.post({
        url, 
        json: {
            appid,
            appsecret
        }
    });

    console.log('request: ', url, 'return: ', res)

    if(!res) {
        throw Error('获取accessToken 失败！');
    }

    const { errorCode, errorMsg } = res;
    const { accessToken, expires_s } = res.data;

    if(0 === errorCode) {
        await _saveAccessTokenToCache({accessToken, expires_s})
        return accessToken;
    }
    else {
        throw Error('获取accessToken错误！', errorMsg);
    }
}

async function _saveAccessTokenToCache({accessToken, expires_s}) {
    const client = redisConnect.getConnect();

    return new Promise((resolve, reject) => {
        client.set(`${PREFIX}accessToken`, accessToken, 'EX', expires_s, function(err, res) {
            if(err) {
                reject(err);
            }
            console.log('redis set key: ', `${PREFIX}accessToken`, 'value: ',  accessToken);
            resolve();
        });
    });
}

async function _getAccessTokenFromCache() {
    const client = redisConnect.getConnect();

    return new Promise((resolve, reject) => {
        client.get(`${PREFIX}accessToken`, function(err, res) {
            if(err) {
                return reject(err);
            }
            console.log('redis get key: ', `${PREFIX}accessToken`, 'value: ',  res);
            resolve(res);
        });
    });
}

module.exports = {
    getAccessToken,
    getSession,
    checkLogin
}

