const REDIS_CONFIG = require('../../config').REDIS_CONFIG;
const redis = require("redis");
let client = null;

module.exports = {
    getConnect: () => {
        if(null !== client) {
            return client;
        }

        client = redis.createClient({
            ...REDIS_CONFIG
        });

        client.on("error", function (err) {
            console.error("Redis Error: " + err);
        });

        return client;
    }
}

