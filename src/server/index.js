const path = require("path")
const express = require("express");
const Handler = require("./src/handler");
const postgre = require("./db/postgre")

const server = express();
const PORT = process.env.PORT || 5000;

// const dbUrl = process.env.DATABASE_URL || "SOMETHING SOMETHING";
// console.log(dbUrl);

// postgre.query('SELECT NOW() as now')
//     .then(res => console.log(res))
//     .catch(err => console.log(err, "OMG DIDNT WORK-----------------"));

// pool.query('SELECT * FROM users;')
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => { console.log(err) })
//     .finally(() => pool.end());

server.use(express.static(path.resolve(__dirname, "../client/build")));
server.use(express.json())

const handler = new Handler(postgre);

server.post("/newavail", async (req, res) => {
    console.log(req.body);
    const msg = await handler.submitAvailability(req.body.userName, req.body.submitAvailability)
    res.status(200).send({msg})
})

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

