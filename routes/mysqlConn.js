var mariadb = require('mysql');

var pool = mariadb.createPool({
    connectionLimit: 5,
    host     : 'localhost',
    user     : 'root',
    password : 'gujc1004',
    database : 'project9'    
});

module.exports = pool;
