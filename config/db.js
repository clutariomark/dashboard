var mysql = require('mysql');

/**
 * MySQL
 */
var dbConfig = {
  development : {
    host: 'localhost',
    user: 'root',
    password: '',
    debug: true,
    trace: true,
    database: 'philippine_cities',
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections : true
  },
  staging : {
    host: 'localhost',
    user: 'root',
    password: 'vbnm8901',
    debug: true,
    trace: true,
    database: 'philippine_cities',
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections : true
  },
  production : {
    host: 'localhost',
    user: 'root',
    password: '',
    debug: true,
    trace: true,
    database: 'philippine_cities',
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections : true
  }
};

console.log(process.env.NODE_ENV);
var pool = mysql.createPool(dbConfig[process.env.NODE_ENV]);

exports.pool = pool;