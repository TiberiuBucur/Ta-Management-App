const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json())

app.post("/newavail", (req, res) => {
  console.log(req.body);

  res.status(200).send({msg: "Updated availability for user: " + req.body.userName})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});