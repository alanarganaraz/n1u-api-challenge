const { createPool } = require('mysql2');

const pool = createPool({
    host: 'localhost',
    user: 'alanroot2',
    password: '123',
    database: 'n1u_challenge_dev',
});

module.exports = pool.promise()