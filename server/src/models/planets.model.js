const planets = require("./planets.mongo");
// const planets = [];
// module.exports = planets;
const path = require("path");
const { parse } = require("csv-parse");
const fs = require("fs");

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
const savePlanet = async (planet) => {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (error) {
    console.log(`Could not save planet ${error}`);
  }
};
const loadPlanetsData = async () => {
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitable(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found`);
      });
    resolve();
  });
};
const getAllPlanets = async () => {
  return await planets.find().select({ __v: 0, _id: 0 });
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
