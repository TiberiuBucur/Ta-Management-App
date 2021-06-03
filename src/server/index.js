
const path = require("path")
const express = require("express");
const db = require("./db/db")

const server = express();
const PORT = process.env.PORT || 5000;

// const dbUrl = process.env.DATABASE_URL || "SOMETHING SOMETHING";
// console.log(dbUrl);

db.query('SELECT NOW() as now')
    .then(res => console.log(res))
    .catch(err => console.log(err, "OMG DIDNT WORK-----------------"));

// pool.query('SELECT * FROM users;')
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => { console.log(err) })
//     .finally(() => pool.end());

server.use(express.static(path.resolve(__dirname, "../client/build")));
server.use(express.json())

server.post("/newavail", (req, res) => {
    console.log(req.body);
    res.status(200).send({msg: "Updated availability for user: " + req.body.userName})
})

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

