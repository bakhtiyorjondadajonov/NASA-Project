const path = require("path");

const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const planetsRouter = require("./routes/planets/planets.router");
const lounchesRouter = require("./routes/lounches/louches.router");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/planets", planetsRouter);
app.use("/launches", lounchesRouter);
app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
