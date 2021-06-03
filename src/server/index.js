const express = require("express");
const path = require("path");
const { Pool, Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

const name = 'ag1319';
const addOn = '5';

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json())

app.post("/newavail", (req, res) => {
    console.log(req.body);
    res.status(200).send({msg: "Updated availability for user: " + req.body.userName})
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'fghijbon8976',
    port: 5432
});


pool.query('SELECT * FROM users;')
    .then(res => {
        console.log(res);
    })
    .catch(err => { console.log(err) })
    .finally(() => pool.end());
