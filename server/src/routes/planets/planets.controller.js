const { getAllPlanets } = require("../../models/planets.model");
exports.httpGetAllPlanets = (req, res) => {
  return res.status(200).json(getAllPlanets());
};
