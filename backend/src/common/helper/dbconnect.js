const mysql = require('mysql2');
const DB_CONFIG = require('../../config').DB_CONFIG
let connection = null;

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://39.106.189.173:27017/admin';
const dbName = 'iass';

module.exports = {
    getConnection: () => {
        if(null !== connection) {
            return connection;
        }

        return connection = mysql.createPool(DB_CONFIG).promise();
    },
    getMGConnection: async () => {
        if(null !== connection) {
            return connection;
        }
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            auth: {
                user:'root',
                password: 'root'
            },
        });
        return connection = client.db(dbName);
    }
}
