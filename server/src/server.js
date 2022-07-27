const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: path.join(__dirname, "config.env") });
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/lounches.model");
const server = http.createServer(app);
console.log(process.env.DB);
const DB = process.env.DB.replace("<password>", process.env.DB_PSW);
console.log("DB:", DB);

const PORT = process.env.PORT || 8000;
mongoose
  .connect(DB)
  .then(() => console.log("Success"))
  .catch((err) => console.log(err));
const startServer = async () => {
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`);
  });
};
startServer();
