const { createPool } = require('mysql2');

const pool = createPool({
    host: 'localhost',
    user: 'alanroot2',
    password: '123',
    database: 'n1u_challenge_test',
});

module.exports = pool.promise()