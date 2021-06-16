import express from "express";
import path from "path";
import Handler from "./handler";
import { postgre } from "./db/postgre";
import {
  Slot,
  slotFromJson,
  recurringSlotFromString,
  RecurringSlot,
} from "./Slot";
import { sample1, sample2 } from "./Samples";

const io = require("socket.io")(5555, {
  cors: {
    origin: "*",
  },
});

io.on("connection", socket => {
  console.log(socket.id);
  socket.on("free_channel", (data: any) => {
    console.log("NEW FREE CHANNEL", data);
    io.emit(`free_channel_for_${data.slotid}`, data.channelNo);
  });
}).setMaxListeners(0);

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

server.get("/sessions", async (req: any, res: any) => {
  try {
    const recs: RecurringSlot[] = await postgre.getRecurring();
    res.status(200).send({ recs });
  } catch (err) {
    console.log(err);
  }
});

server.get("/schedule/:shortcode", async (req, res) => {
  const { shortcode } = req.params;

  if (shortcode === "sample1") {
    res.status(200).json(sample1);
  } else if (shortcode === "sample2") {
    res.status(200).json(sample2);
  }

  try {
    // TODO: change any to a concrete type after merging with frontend (type defined on FE)
    const [avails, nextSession] = await postgre.getAvailability(shortcode);
    if (!avails || avails.length === 0) {
      res.status(404).send();
      return;
    }
    const term = avails[0].term;
    res.status(200).json({
      shortcode: shortcode,
      term: term,
      nextsession: nextSession,
      slots: avails,
    });
  } catch (err) {
    console.log(err);
  }
});

server.post("/submitallsessions", async (req, res) => {
  const { slots, recurring } = req.body;
  console.log(slots);
  const data: Slot[] = slots.map(s => slotFromJson(s));
  let recurrings: RecurringSlot[] = (recurring || []).map(r =>
    recurringSlotFromString(r)
  );

  try {
    const msg = await handler.submitSessions(data, recurrings);
    res.status(200).send({ msg });
  } catch (err) {
    console.log(err);
    res.status(404).send();
  }
});

server.get("/allavailabilities", async (_, res) => {
  const qresponse = await postgre.pool.query("SELECT * FROM tas");
  const { rows } = qresponse;

  res.status(200).json({ rows });
});

server.get("*", (_, res) => {
  res.sendFile(pathToRedirect);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
