const mysql = require('mysql2/promise');
const config = {
    host     : '39.106.189.173',
    user     : 'root',
    password : 'root',
    database : 'docker'
}
let connection = null;

module.exports = {
    init: () => {
        mysql.createConnection(config).then(c => {
            connection = c ;
        }, err => {
            console.error(err);
        })
    },
    getConnection: () => {
        return connection;
    }
}
