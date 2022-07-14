const launches = new Map();
const lounch = {
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  lounchDate: new Date("December, 27,2030"),
  target: "Kepler-442 b",
  upcoming: true,
  success: true,
  flightNumber: 100,
  customers: ["ZTM", "NASA"],
};
let latestFlightNumber = 100;
launches.set(lounch.flightNumber, lounch);

const addNewLouch = (lounch) => {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(lounch, {
      upcoming: true,
      success: true,
      flightNumber: latestFlightNumber,
      customers: ["ZTM", "NASA"],
    })
  );
};
const existslauncheWithId = (launchId) => {
  return launches.has(launchId);
};
const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
};
const getAllLaunches = () => {
  return Array.from(launches.values());
};

module.exports = {
  getAllLaunches,
  addNewLouch,
  existslauncheWithId,
  abortLaunchById,
};
