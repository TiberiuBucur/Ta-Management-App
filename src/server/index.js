const express = require("express");
const path = require("path");
const { Pool, Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL || "SOMETHING SOMETHING";
console.log(dbUrl);

const name = 'ag1319';
const addOn = '5';
const devMode = false;

let pool;
if (devMode) {

    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'testdb',
        password: 'fghijbon8976',
        port: 5432
    });
} else {
    pool = new Pool({
        connectionString: dbUrl
    });
}


pool.query('SELECT NOW() as now')
    .then(res => console.log(res))
    .catch(err => console.log(err, "OMG DIDNT WORK---------------------------------------------------------------"));

// pool.query('SELECT * FROM users;')
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => { console.log(err) })
//     .finally(() => pool.end());

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json())

app.post("/newavail", (req, res) => {
    console.log(req.body);
    res.status(200).send({msg: "Updated availability for user: " + req.body.userName})
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

