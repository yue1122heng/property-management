var mysql = require('mysql');

var options = {
    pool: mysql.createPool({
        user: 'root', 
        password: '111111', 
        database: 'estate'
    })
}

module.exports = {
    mysql,
    options
}