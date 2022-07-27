const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = new Map();

const SPACEX_API_URL = `https://api.spacexdata.com/v4/launches/query`;

async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Problem downloading launches");
    throw new Error("Launch data download failed!");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["data_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(launch.flightNumber, launch.mission);

    //TODO: populate launches collection...
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded");
  } else {
    await populateLaunches();
  }
}

const DEFAULT_FLIGHT_NUMBER = 100;
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
async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

const existslauncheWithId = async (launchId) => {
  return await findLaunch({ flightNumber: launchId });
};
const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
};
const getAllLaunches = async (skip, limit) => {
  return await launchesDatabase
    .find({})
    .sort({ flightNumber: 1 })
    .select({ _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit);
};
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  } else {
    return latestLaunch.flightNumber;
  }
}
async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  addNewLouch,
  existslauncheWithId,
  abortLaunchById,
  scheduleNewLaunch,
};
