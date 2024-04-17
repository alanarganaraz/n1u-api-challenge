const { createPool } = require('mysql2');
const config = require('../config/enviroment-prod.json')

const pool = createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
});


module.exports = pool.promise()