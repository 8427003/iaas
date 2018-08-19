const mysql = require('mysql2');
const DB_CONFIG = require('../../config').DB_CONFIG
let connection = null;

module.exports = {
    getConnection: () => {
        if(null !== connection) {
            return connection;
        }

        return connection = mysql.createPool(DB_CONFIG).promise();
    }
}
