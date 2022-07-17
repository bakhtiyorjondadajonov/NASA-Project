const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const DB = process.env.DB;
console.log("process.env: ", process.env);
console.log("DB: ", DB);

const startServer = async () => {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`);
  });
};
startServer();
