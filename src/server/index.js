const path = require("path");
const express = require("express");
const Handler = require("./src/handler");
const postgre = require("./db/postgre");

const server = express();
const PORT = process.env.PORT || 5000;

server.use(express.static(path.resolve(__dirname, "../client/build")));
server.use(express.json());

const handler = new Handler(postgre);

server.post("/newavail/:username", async (req, res) => {
  console.log(req);

  const { username } = req.params;
  const availability = req.body;
  const msg = await handler.submitAvailability(username, availability);
  res.status(200).send({ msg });
});

server.get("/allavailabilities", async (req, res) => {
  const qresponse = await postgre.pool.query("SELECT * FROM tas");
  const { rows } = qresponse;

  res.status(200).json({ rows })
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
