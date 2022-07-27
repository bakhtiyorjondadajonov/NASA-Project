const {
  getAllLaunches,
  addNewLouch,
  existslauncheWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/lounches.model");
const { getPagination } = require("../../services/query");
const httpGetAllLounches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};
const httpAddNewLounch = async (req, res) => {
  const launch = {
    target: req.body.target,
    launchDate: new Date(req.body.launchDate),
    rocket: req.body.rocket,
    mission: req.body.mission,
  };

  if (
    !launch.target ||
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    launch.launchDate == "Invalid Date"
  ) {
    res.status(400).json({
      message: "Missing required lounch properity or Invalid date input",
    });
  } else {
    await scheduleNewLaunch(launch);
    return res.status(201).json({
      status: "Success",
      data: launch,
    });
  }
};
const httpAbortLaunch = async (req, res) => {
  const launchId = +req.params.id;

  //if launch does not exist
  const existsLaunch = await existslauncheWithId(launchId);
  if (existsLaunch) {
    //if launch does  exist
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
      return res.status(400).json({ error: "Launch not aborted" });
    }
    return res.status(200).json({ ok: true });
  } else {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
};
module.exports = {
  httpGetAllLounches,
  httpAddNewLounch,
  httpAbortLaunch,
};
