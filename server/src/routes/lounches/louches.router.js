const express = require("express");

const router = express.Router();

const {
  httpGetAllLounches,
  httpAddNewLounch,
  httpAbortLaunch,
} = require("./lounches.controller");
router.route("/").get(httpGetAllLounches).post(httpAddNewLounch);
router.route("/:id").delete(httpAbortLaunch);

module.exports = router;
