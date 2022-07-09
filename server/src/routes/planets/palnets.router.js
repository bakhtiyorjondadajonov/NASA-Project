const express = require("express");

const { getAllPlanets } = require("./planets.controller");

const router = express.Router();

router.route("/planets").get(getAllPlanets);
module.exports = router;
