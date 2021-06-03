// TODO: Add rng for testing
const testVersion = 15;
const { Pool, Client } = require('pg');

const failedDbConnectionCode = 1;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'fghijbon8976',
    port: 5432
});

const erronousExit = (err) => {
    if (err) { console.log(err); }
    pool.end();
    process.exit(failedDbConnectionCode);
};


const insertionQuery = `INSERT INTO users (email, name, course) VALUES ('test${testVersion}@test.ac.uk', 'Tester${testVersion}', 'test${testVersion}');`;
pool.query(insertionQuery)
    .then(res => {
        console.log('Managed to insert into DB');
        console.log(res);
        const insertedQuery = `SELECT email FROM users WHERE name = 'Tester${testVersion}';`;
        return pool.query(insertedQuery);   
    })
    .then(res => {
        if (res.rowCount == 0) {
            console.log('Got back no entries into DB. Test failed');
            erronousExit(null);
        } else {
            console.log('Insertion successful. Got back:');
            console.log(res);
        }})
    .catch(erronousExit)
    .finally(() => pool.end());

