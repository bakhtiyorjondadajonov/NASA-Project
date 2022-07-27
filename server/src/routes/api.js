const express = require("express");
const api = express.Router();

const planetsRouter = require("./planets/planets.router");
const lounchesRouter = require("./lounches/louches.router");

api.use("/planets", planetsRouter);
api.use("/launches", lounchesRouter);
module.exports = api;
