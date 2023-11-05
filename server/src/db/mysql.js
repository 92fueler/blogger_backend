const mysql = require('mysql2')
const { MYSQL_CONF } = require('../conf/db.js')
console.log("mysql_conf", MYSQL_CONF)
// create connection
const con = mysql.createConnection(MYSQL_CONF)

// start connecting
// this is callback approach
// con.connect((err) => {
//     if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//     }
//     console.log('Connected to MySQL database');
// });

// this is separate event listener approach
con.on('error', (err) => {
    console.error('Error connecting to MySQL:', err);
});

con.on('connect', () => {
    console.log('Connected to MySQL database');
});

con.connect(); // Start connecting

// exec func to execute all sql
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec
    // escape: mysql.escape
}