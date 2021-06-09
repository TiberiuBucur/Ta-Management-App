import express from "express";
import path from "path";
import Handler from "./handler";
import { postgre } from "../db/postgre";

const server = express();
const PORT = process.env.PORT || 5000;

const pathToStaticContent = path.resolve(__dirname, "../build");
const pathToRedirect = path.resolve(__dirname, "../build/redirect.html");
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
    // TODO: change any to a concrete type after merging with frontend (type defined on FE)
    const [avails, nextSession] = await postgre.getAvailability(shortcode);
    if (!avails || avails.length === 0) {
      res.status(200).json(200).json({ shortcode: shortcode, slots: [] });
      return;
    }
    const term = avails[0].term;
    res.status(200).json({ shortcode: shortcode, term: term, nextsession: nextSession, slots: avails });
  }
  catch (err) { console.log(err) };

});

server.post("/submitallsessions", async (req, res) => {
  const { slots } = req.body;
  const msg = await handler.submitSessions(slots);
  
  res.status(200).send({ msg });
});

server.get("/allavailabilities", async (_, res) => {
  const qresponse = await postgre.pool.query("SELECT * FROM tas");
  const { rows } = qresponse;
  
  res.status(200).json({ rows })
});

server.get("*", (_, res) => {
  res.sendFile(pathToRedirect);
  
})

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
