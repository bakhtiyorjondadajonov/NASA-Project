const {
  getAllLaunches,
  addNewLouch,
  existslauncheWithId,
  abortLaunchById,
} = require("../../models/lounches.model");
const httpGetAllLounches = (req, res) => {
  return res.status(200).json(getAllLaunches());
};
const httpAddNewLounch = (req, res) => {
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
    addNewLouch(launch);
    return res.status(201).json({
      status: "Success",
      data: launch,
    });
  }
};
const httpAbortLaunch = (req, res) => {
  const launchId = +req.params.id;

  //if launch does not exist
  if (existslauncheWithId(launchId)) {
    //if launch does  exist
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
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
