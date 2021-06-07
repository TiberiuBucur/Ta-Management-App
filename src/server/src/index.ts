import express from "express";
import path from "path";
import Handler from "./handler";
import { postgre } from "../db/postgre";

const server = express();
const PORT = process.env.PORT || 5000;

const pathToStaticContent = path.resolve(__dirname, "../build");
console.log(pathToStaticContent);

server.use(express.static(pathToStaticContent));
server.use(express.json());

const handler = new Handler(postgre);

server.post("/newavail/:username", async (req, res) => {
  const { username } = req.params;
  const availability = req.body;
  const msg = await handler.submitAvailability(username, availability);
  res.status(200).send({ msg });
});

server.get("/schedule/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  try {
    const avails: any = await postgre.getAvailability(shortcode);
    res.status(200).json({ avails });
  }
  catch (err) { console.log(err) };

});

server.get("/allavailabilities", async (_req, res) => {
  const qresponse = await postgre.pool.query("SELECT * FROM tas");
  const { rows } = qresponse;

  res.status(200).json({ rows })
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
