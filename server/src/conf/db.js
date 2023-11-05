require('dotenv').config();

const env = process.env.NODE_ENV;
console.log(`loading ${env} env vars ... `)

const MYSQL_CONF = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE
};

const REDIS_CONF = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
};

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
};
